import z from "zod";

export const CharIdSchema = z.object({
  site: z.string(),
  counter: z.number().int().nonnegative(),
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
