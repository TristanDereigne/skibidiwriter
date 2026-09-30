import { auth } from "@/libs/auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const requireAuth = createMiddleware(async (ctx, next) => {
  const session = await auth.api.getSession({ headers: ctx.req.raw.headers });
  if (!session) throw new HTTPException(401, { message: "Unauthorized" });

  await next();
});
