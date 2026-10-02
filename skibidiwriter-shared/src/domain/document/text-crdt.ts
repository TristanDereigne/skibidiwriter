import { diffText } from "./diff";
import type { CharId, DocumentOperation } from "./operations";

type Char = {
  id: CharId;
  value: string;
  deleted: boolean;
};

function compareIds(a: CharId, b: CharId): number {
  if (a.counter !== b.counter) return a.counter - b.counter;

  if (a.site < b.site) return -1;
  if (a.site > b.site) return 1;

  return 0;
}

export class TextCrdt {
  readonly #site: string;
  readonly #chars: Char[] = [];
  #clock = 0;

  constructor(site: string) {
    this.#site = site;
  }

  get text(): string {
    return this.#visibleChars()
      .map((char) => char.value)
      .join("");
  }

  setText(text: string): DocumentOperation[] {
    const { start, deleteCount, insert } = diffText(this.text, text);
    const visible = this.#visibleChars();
    const operations: DocumentOperation[] = [];

    for (const char of visible.slice(start, start + deleteCount)) {
      const operation: DocumentOperation = { type: "delete", id: char.id };
      this.#integrateDelete(operation);
      operations.push(operation);
    }

    let after = visible[start - 1]?.id ?? null;
    for (const value of insert) {
      const operation: DocumentOperation = {
        type: "insert",
        id: { site: this.#site, counter: this.#clock + 1 },
        after,
        value,
      };
      this.#integrateInsert(operation);
      operations.push(operation);
      after = operation.id;
    }

    return operations;
  }

  apply(operations: DocumentOperation[]): DocumentOperation[] {
    return operations.filter((operation) =>
      operation.type === "insert"
        ? this.#integrateInsert(operation)
        : this.#integrateDelete(operation),
    );
  }

  toOperations(): DocumentOperation[] {
    const operations: DocumentOperation[] = [];
    let after: CharId | null = null;

    for (const char of this.#chars) {
      operations.push({
        type: "insert",
        id: char.id,
        after,
        value: char.value,
      });

      if (char.deleted) {
        operations.push({ type: "delete", id: char.id });
      }

      after = char.id;
    }

    return operations;
  }

  #visibleChars(): Char[] {
    return this.#chars.filter((char) => !char.deleted);
  }

  #indexOf(id: CharId): number {
    return this.#chars.findIndex((char) => compareIds(char.id, id) === 0);
  }

  #integrateInsert({
    id,
    after,
    value,
  }: Extract<DocumentOperation, { type: "insert" }>): boolean {
    if (this.#indexOf(id) !== -1) return false;

    let index = 0;
    if (after) {
      const afterIndex = this.#indexOf(after);
      if (afterIndex === -1) return false;
      index = afterIndex + 1;
    }

    while (
      index < this.#chars.length &&
      compareIds(this.#chars[index]!.id, id) > 0
    ) {
      index++;
    }

    this.#chars.splice(index, 0, { id, value, deleted: false });
    this.#clock = Math.max(this.#clock, id.counter);

    return true;
  }

  #integrateDelete({
    id,
  }: Extract<DocumentOperation, { type: "delete" }>): boolean {
    const char = this.#chars[this.#indexOf(id)];
    if (!char || char.deleted) return false;

    char.deleted = true;

    return true;
  }
}
