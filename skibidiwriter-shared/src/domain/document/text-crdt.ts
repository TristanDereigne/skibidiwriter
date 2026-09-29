import { diffText } from "./diff";
import type { CharId, DocumentOperation } from "./operations";

type Char = {
  id: CharId;
  value: string;
  deleted: boolean;
};

function compareIds(a: CharId, b: CharId): number {
  if (a.counter !== b.counter) return a.counter - b.counter;
  return a.site < b.site ? -1 : a.site > b.site ? 1 : 0;
}

function sameId(a: CharId, b: CharId): boolean {
  return compareIds(a, b) === 0;
}

export class TextCrdt {
  #chars: Char[] = [];
  #clock = 0;
  readonly #site: string;

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
    const operations: DocumentOperation[] = [];

    for (let i = 0; i < deleteCount; i++) {
      operations.push(this.#deleteAt(start));
    }

    for (let i = 0; i < insert.length; i++) {
      operations.push(this.#insertAt(start + i, insert[i]!));
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
    let previous: Char | undefined;

    for (const char of this.#chars) {
      operations.push({
        type: "insert",
        id: char.id,
        after: previous?.id ?? null,
        value: char.value,
      });

      if (char.deleted) {
        operations.push({ type: "delete", id: char.id });
      }

      previous = char;
    }

    return operations;
  }

  #visibleChars(): Char[] {
    return this.#chars.filter((char) => !char.deleted);
  }

  #indexOf(id: CharId): number {
    return this.#chars.findIndex((char) => sameId(char.id, id));
  }

  #insertAt(index: number, value: string): DocumentOperation {
    const after = this.#visibleChars()[index - 1]?.id ?? null;
    const operation: DocumentOperation = {
      type: "insert",
      id: { site: this.#site, counter: this.#clock + 1 },
      after,
      value,
    };

    this.#integrateInsert(operation);

    return operation;
  }

  #deleteAt(index: number): DocumentOperation {
    const operation: DocumentOperation = {
      type: "delete",
      id: this.#visibleChars()[index]!.id,
    };

    this.#integrateDelete(operation);

    return operation;
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
