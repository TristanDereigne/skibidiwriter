import { createMiddleware } from 'hono/factory';
import {auth} from "@/libs/auth";

type Env = {
    Variables: {
        session: typeof auth.$Infer.Session | null;
        user: typeof auth.$Infer.Session.user | null;
    };
};

export const sessionMiddleware = createMiddleware < Env > (async (c, next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });
    c.set("session", session);
    c.set("user", session?.user || null);
    await next();
});
