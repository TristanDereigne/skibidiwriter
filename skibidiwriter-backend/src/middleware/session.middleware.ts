import { auth } from "@/libs/auth";
import { createMiddleware } from "hono/factory";
import { ErrorCode } from "skibidiwriter-shared";

export type AuthEnv = {
  Variables: {
    session: typeof auth.$Infer.Session.session;
    user: typeof auth.$Infer.Session.user;
    userId: string;
  };
};

export const sessionMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) return c.json({ code: ErrorCode.Auth_Unauthorized }, 401);

  c.set("session", session.session);
  c.set("user", session.user);
  c.set("userId", session.user.id);
  await next();
});
