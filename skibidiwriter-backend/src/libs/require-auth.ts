import { auth } from "@/libs/auth";
import { createMiddleware } from "hono/factory";
import { ErrorCode } from "skibidiwriter-shared";

export type AuthEnv = { Variables: { userId: string } };

export const requireAuth = createMiddleware<AuthEnv>(async (ctx, next) => {
  const session = await auth.api.getSession({ headers: ctx.req.raw.headers });
  if (!session) return ctx.json({ code: ErrorCode.Auth_Unauthorized }, 401);

  ctx.set("userId", session.user.id);
  await next();
});
