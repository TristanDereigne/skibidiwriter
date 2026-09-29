export interface TextChange {
  start: number;
  deleteCount: number;
  insert: string;
}

export function diffText(previous: string, next: string): TextChange {
  const maxPrefix = Math.min(previous.length, next.length);
  let start = 0;
  while (start < maxPrefix && previous[start] === next[start]) start++;

  const maxSuffix = maxPrefix - start;
  let suffix = 0;
  while (
    suffix < maxSuffix &&
    previous[previous.length - 1 - suffix] === next[next.length - 1 - suffix]
  ) {
    suffix++;
  }

  return {
    start,
    deleteCount: previous.length - start - suffix,
    insert: next.slice(start, next.length - suffix),
  };
}

export function mapCursor(cursor: number, change: TextChange): number {
  if (cursor <= change.start) return cursor;
  if (cursor >= change.start + change.deleteCount) {
    return cursor - change.deleteCount + change.insert.length;
  }
  return change.start + change.insert.length;
}
