import { auth } from "@/libs/auth";
import { createMiddleware } from "hono/factory";
import { ErrorCode } from "skibidiwriter-shared";

export type AuthEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    userId: string;
    sessionId: string;
  };
};

export const sessionMiddleware = createMiddleware<AuthEnv>(
  async (ctx, next) => {
    const session = await auth.api.getSession({
      headers: ctx.req.raw.headers,
    });
    if (!session) return ctx.json({ code: ErrorCode.Auth_Unauthorized }, 401);

    ctx.set("user", session.user);
    ctx.set("userId", session.user.id);
    ctx.set("sessionId", session.session.id);

    await next();
  },
);
