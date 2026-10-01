import { db } from "@/libs/db";
import { validate } from "@/libs/validation";
import { toFileShareDTO } from "@/mappers/file-share.mapper";
import { AuthEnv } from "@/middleware/session.middleware";
import { fileShareTable } from "@/models";
import fileShareService from "@/services/file-share.service";
import fileService from "@/services/file.service";
import userService from "@/services/user.service";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { CreateFileSharesSchema, ErrorCode } from "skibidiwriter-shared";

export const fileShareController = new Hono<AuthEnv>()
  .get("/", async (ctx) => {
    const userId = ctx.get("userId");

    const shares = await db
      .select()
      .from(fileShareTable)
      .where(eq(fileShareTable.userId, userId));

    return ctx.json(shares.map(toFileShareDTO));
  })
  .post("/", validate("json", CreateFileSharesSchema), async (ctx) => {
    const userId = ctx.get("userId");
    const { fileId, userIds } = ctx.req.valid("json");

    const isOwner = await fileService.isOwner(fileId, userId);
    if (!isOwner) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

    const recipientIds = [...new Set(userIds)].filter((id) => id !== userId);

    const areUsersFound = await userService.existAll(recipientIds);
    if (!areUsersFound) return ctx.json({ code: ErrorCode.User_NotFound }, 404);

    const rows = await fileShareService.createMany(fileId, recipientIds);

    return ctx.json(rows.map(toFileShareDTO), 201);
  });
