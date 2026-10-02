import { env } from "@/libs/env";
import { createMiddleware } from "hono/factory";
import { ErrorCode } from "skibidiwriter-shared";

export const originMiddleware = createMiddleware(async (ctx, next) => {
  if (ctx.req.header("origin") !== env.FRONTEND_URL_NO_SLASH) {
    return ctx.body(
      JSON.stringify({ code: ErrorCode.Auth_Unauthorized }),
      403,
      {
        "Content-Type": "application/json",
      },
    );
  }

  await next();
});
