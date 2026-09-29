import { eq, isNull, type Column } from "drizzle-orm";

export function eqOrNull(column: Column, value: string | null) {
  return value === null ? isNull(column) : eq(column, value);
}
