import { validate } from "@/libs/validation";
import { toFileShareDTO, toSharedFileDTO } from "@/mappers/file-share.mapper";
import type { AuthEnv } from "@/middleware/session.middleware";
import fileShareService from "@/services/file-share.service";
import fileService from "@/services/file.service";
import userService from "@/services/user.service";
import { Hono } from "hono";
import { CreateFileSharesSchema, ErrorCode } from "skibidiwriter-shared";

export const fileShareController = new Hono<AuthEnv>()
  .get("/", async (ctx) => {
    const rows = await fileService.findSharedWith(ctx.get("userId"));

    return ctx.json(rows.map(toSharedFileDTO));
  })
  .post("/", validate("json", CreateFileSharesSchema), async (ctx) => {
    const userId = ctx.get("userId");
    const { fileId, userIds } = ctx.req.valid("json");

    const isOwner = await fileService.isOwner(fileId, userId);
    if (!isOwner) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

    if (userIds.includes(userId))
      return ctx.json({ code: ErrorCode.FileShare_SelfShare }, 400);

    const recipientIds = [...new Set(userIds)];

    const areUsersFound = await userService.existAll(recipientIds);
    if (!areUsersFound) return ctx.json({ code: ErrorCode.User_NotFound }, 404);

    const rows = await fileShareService.createMany(fileId, recipientIds);

    return ctx.json(rows.map(toFileShareDTO), 201);
  });
