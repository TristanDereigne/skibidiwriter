import z from "zod";

export const CharIdSchema = z.object({
  site: z.string().min(1).max(64),
  counter: z
    .number()
    .int()
    .nonnegative()
    .max(2 ** 31 - 1),
});
export type CharId = z.infer<typeof CharIdSchema>;

export const DocumentOperationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("insert"),
    id: CharIdSchema,
    after: CharIdSchema.nullable(),
    value: z.string().length(1),
  }),
  z.object({
    type: z.literal("delete"),
    id: CharIdSchema,
  }),
]);
export type DocumentOperation = z.infer<typeof DocumentOperationSchema>;

export interface Snapshot {
  sites: string[];
  chars: [site: number, counter: number, value: string, isDeleted: boolean][];
}
