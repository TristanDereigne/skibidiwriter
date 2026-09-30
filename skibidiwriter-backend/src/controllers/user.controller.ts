import { Hono } from "hono";
import type { AuthEnv } from "@/middleware/session.middleware";
import { HTTPException } from "hono/http-exception";
import {
  checkTwoFactorEnabled,
  updateUserEmail,
} from "@/services/user.service";

export const userController = new Hono<AuthEnv>()
  .post("/email", async (ctx) => {
    const user = ctx.get("user");
    const body = await ctx.req.json();

    const actualEmail: string = user.email;
    const newEmail: string = body.email;

    if (actualEmail == newEmail) {
      throw new HTTPException(409, { message: "Same email" });
    }

    if (body.email && user) {
      try {
        await updateUserEmail(actualEmail, newEmail);
      } catch (error) {
        ctx.status(500);
        return ctx.json({ statut: "error", message: error });
      }
      ctx.status(200);
      return ctx.json({ statut: "success", email: newEmail });
    } else {
      ctx.status(400);
      return ctx.json({ statut: "Request is malformated" });
    }
  })
  .get("/authtwofactor", async (ctx) => {
    const user = ctx.get("user");
    const userEmail: string = user.email;

    if (userEmail) {
      const isTwoFactorEnabled: boolean | null | undefined =
        await checkTwoFactorEnabled(userEmail);

      if (isTwoFactorEnabled) {
        ctx.status(200);
        return ctx.json({ two_factor_enabled: true });
      } else {
        ctx.status(200);
        return ctx.json({ two_factor_enabled: false });
      }
    } else {
      ctx.status(404);
    }
  });
