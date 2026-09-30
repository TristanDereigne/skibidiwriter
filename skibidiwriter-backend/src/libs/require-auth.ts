import { auth } from "@/libs/auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export type AuthEnv = { Variables: { userId: string } };

export const requireAuth = createMiddleware<AuthEnv>(async (ctx, next) => {
  const session = await auth.api.getSession({ headers: ctx.req.raw.headers });
  if (!session) throw new HTTPException(401, { message: "Non autorisé" });

  ctx.set("userId", session.user.id);
  await next();
});
