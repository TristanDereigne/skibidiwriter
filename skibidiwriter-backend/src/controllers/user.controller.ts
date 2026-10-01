import { validate } from "@/libs/validation";
import { toUserSummaryDTO } from "@/mappers/user.mapper";
import type { AuthEnv } from "@/middleware/session.middleware";
import userService from "@/services/user.service";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";

const SearchQuerySchema = z.object({ search: z.string() });

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
        await userService.updateUserEmail(actualEmail, newEmail);
      } catch (error) {
        return ctx.json({ statut: "error", message: error }, 500);
      }

      return ctx.json({ statut: "success", email: newEmail }, 200);
    } else {
      return ctx.json({ statut: "Request is malformated" }, 400);
    }
  })
  .get("/authtwofactor", async (ctx) => {
    const user = ctx.get("user");
    const userEmail: string = user.email;

    if (userEmail) {
      const isTwoFactorEnabled: boolean | null | undefined =
        await userService.checkTwoFactorEnabled(userEmail);

      if (isTwoFactorEnabled) {
        return ctx.json({ two_factor_enabled: true }, 200);
      }

      return ctx.json({ two_factor_enabled: false }, 200);
    }

    ctx.status(404);
  })
  .get("/search", validate("query", SearchQuerySchema), async (ctx) => {
    const { search } = ctx.req.valid("query");

    const users = await userService.findManyByName(search, 5);

    return ctx.json(users.map(toUserSummaryDTO));
  });
