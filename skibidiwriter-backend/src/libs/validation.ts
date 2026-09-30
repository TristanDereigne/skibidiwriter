import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import { ErrorCode } from "skibidiwriter-shared";
import z from "zod";

export const IdParamSchema = z.object({ id: z.uuid() });

export function validate<
  Target extends keyof ValidationTargets,
  Schema extends z.ZodType,
>(target: Target, schema: Schema) {
  return zValidator(target, schema, (result, ctx) => {
    if (!result.success)
      return ctx.json({ code: ErrorCode.Request_Invalid }, 400);
  });
}
