import { diffText } from "./diff";
import type { CharId, DocumentOperation } from "./operations";

type Char = {
  id: CharId;
  value: string;
  deleted: boolean;
  next: Char | null;
};

function compareIds(a: CharId, b: CharId): number {
  if (a.counter !== b.counter) return a.counter - b.counter;

  if (a.site < b.site) return -1;
  if (a.site > b.site) return 1;

  return 0;
}

function idKey(id: CharId): string {
  return `${id.site}:${id.counter}`;
}

export class TextCrdt {
  readonly #site: string;
  readonly #chars = new Map<string, Char>();
  #head: Char | null = null;
  #clock = 0;

  constructor(site: string) {
    this.#site = site;
  }

  get text(): string {
    let text = "";

    for (let char = this.#head; char; char = char.next) {
      if (!char.deleted) text += char.value;
    }

    return text;
  }

  setText(text: string): DocumentOperation[] {
    const { start, deleteCount, insert } = diffText(this.text, text);
    const operations: DocumentOperation[] = [];
    const anchor = this.#visibleAt(start - 1);

    let remaining = deleteCount;
    for (
      let char = anchor ? anchor.next : this.#head;
      char && remaining > 0;
      char = char.next
    ) {
      if (char.deleted) continue;

      char.deleted = true;
      operations.push({ type: "delete", id: char.id });
      remaining--;
    }

    let after = anchor?.id ?? null;
    for (let i = 0; i < insert.length; i++) {
      const operation: DocumentOperation = {
        type: "insert",
        id: { site: this.#site, counter: this.#clock + 1 },
        after,
        value: insert[i]!,
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

    for (let char = this.#head; char; char = char.next) {
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

  #visibleAt(index: number): Char | null {
    let remaining = index;

    for (let char = this.#head; char && remaining >= 0; char = char.next) {
      if (char.deleted) continue;
      if (remaining === 0) return char;
      remaining--;
    }

    return null;
  }

  #integrateInsert({
    id,
    after,
    value,
  }: Extract<DocumentOperation, { type: "insert" }>): boolean {
    if (this.#chars.has(idKey(id))) return false;

    let previous: Char | null = null;
    if (after) {
      previous = this.#chars.get(idKey(after)) ?? null;
      if (!previous) return false;
    }

    let next = previous ? previous.next : this.#head;
    while (next && compareIds(next.id, id) > 0) {
      previous = next;
      next = next.next;
    }

    const char: Char = { id, value, deleted: false, next };
    if (previous) previous.next = char;
    else this.#head = char;

    this.#chars.set(idKey(id), char);
    this.#clock = Math.max(this.#clock, id.counter);

    return true;
  }

  #integrateDelete({
    id,
  }: Extract<DocumentOperation, { type: "delete" }>): boolean {
    const char = this.#chars.get(idKey(id));
    if (!char || char.deleted) return false;

    char.deleted = true;

    return true;
  }
}
