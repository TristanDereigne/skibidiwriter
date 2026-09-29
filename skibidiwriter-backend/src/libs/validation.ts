import { validator } from "hono/validator";
import z from "zod";

export const IdParamSchema = z.object({ id: z.uuid() });

export function validate<
  Target extends "json" | "query" | "param",
  Schema extends z.ZodType,
>(target: Target, schema: Schema) {
  return validator(target, (value, ctx) => {
    const result = schema.safeParse(value);
    if (!result.success) return ctx.json({ error: "Invalid request" }, 400);

    return result.data as z.output<Schema>;
  });
}
