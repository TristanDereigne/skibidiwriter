import { validate } from "@/libs/validation";
import { toUserSummaryDTO } from "@/mappers/user.mapper";
import type { AuthEnv } from "@/middleware/session.middleware";
import userService from "@/services/user.service";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ErrorCode, UsernameSearchSchema } from "skibidiwriter-shared";
import z from "zod";

const SearchQuerySchema = z.object({ search: UsernameSearchSchema });
const UpdateEmailSchema = z.object({ email: z.email() });

export const userController = new Hono<AuthEnv>()
  .post("/email", validate("json", UpdateEmailSchema), async (ctx) => {
    const { email } = ctx.req.valid("json");
    const currentEmail = ctx.get("user").email;

    if (email === currentEmail) {
      throw new HTTPException(409, { message: "Same email" });
    }

    await userService.updateUserEmail(currentEmail, email);

    return ctx.json({ email });
  })
  .get("/authtwofactor", async (ctx) => {
    const twoFactorEnabled = await userService.checkTwoFactorEnabled(
      ctx.get("user").email,
    );

    return ctx.json({ two_factor_enabled: twoFactorEnabled });
  })
  .get("/admin", (ctx) => {
    const isAdmin = ctx.get("user").role === "admin";

    return ctx.json({ role: isAdmin ? "admin" : "user" });
  })
  .get("/users", async (ctx) => {
    if (ctx.get("user").role !== "admin") {
      return ctx.json({ code: ErrorCode.Auth_Unauthorized }, 403);
    }

    return ctx.json(await userService.getUsers());
  })
  .get("/search", validate("query", SearchQuerySchema), async (ctx) => {
    const { search } = ctx.req.valid("query");

    const users = await userService.findUsersByName(
      search,
      5,
      ctx.get("userId"),
    );

    return ctx.json(users.map(toUserSummaryDTO));
  });
