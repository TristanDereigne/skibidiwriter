import { sendToUser } from "@/libs/socket";
import { IdParamSchema, validate } from "@/libs/validation";
import { toFileShareDTO, toSharedFileDTO } from "@/mappers/file-share.mapper";
import type { AuthEnv } from "@/middleware/session.middleware";
import fileShareService from "@/services/file-share.service";
import fileService from "@/services/file.service";
import notificationService from "@/services/notification.service";
import userService from "@/services/user.service";
import { toUserSummaryDTO } from "@/mappers/user.mapper";
import { evictUser } from "./socket.controller";
import { Hono } from "hono";
import {
  CreateFileSharesSchema,
  ErrorCode,
  NotificationType,
  ServerEventType,
} from "skibidiwriter-shared";
import z from "zod";

const RevokeParamSchema = z.object({ id: z.uuid(), userId: z.string() });

export const fileShareController = new Hono<AuthEnv>()
  .get("/", async (ctx) => {
    const rows = await fileService.findSharedWith(ctx.get("userId"));

    return ctx.json(rows.map(toSharedFileDTO));
  })
  .get("/:id", validate("param", IdParamSchema), async (ctx) => {
    const { id } = ctx.req.valid("param");

    const isOwner = await fileService.isOwner(id, ctx.get("userId"));
    if (!isOwner) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

    const rows = await fileShareService.findRecipients(id);

    return ctx.json(rows.map(toUserSummaryDTO));
  })
  .post("/", validate("json", CreateFileSharesSchema), async (ctx) => {
    const userId = ctx.get("userId");
    const { fileId, userIds } = ctx.req.valid("json");

    const file = await fileService.findOwnedById(fileId, userId);
    if (!file) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

    if (userIds.includes(userId))
      return ctx.json({ code: ErrorCode.FileShare_SelfShare }, 400);

    const recipientIds = [...new Set(userIds)];

    const areUsersFound = await userService.existAll(recipientIds);
    if (!areUsersFound) return ctx.json({ code: ErrorCode.User_NotFound }, 404);

    const rows = await fileShareService.createMany(fileId, recipientIds);

    for (const row of rows) {
      await notificationService.notify(row.userId, {
        type: NotificationType.File_Shared,
        fileId,
        fileName: file.name,
        sharedBy: toUserSummaryDTO(ctx.get("user")),
      });
    }

    return ctx.json(rows.map(toFileShareDTO), 201);
  })
  .delete("/:id/:userId", validate("param", RevokeParamSchema), async (ctx) => {
    const { id, userId } = ctx.req.valid("param");

    const isOwner = await fileService.isOwner(id, ctx.get("userId"));
    if (!isOwner) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

    const isRevoked = await fileShareService.remove(id, userId);
    if (!isRevoked)
      return ctx.json({ code: ErrorCode.FileShare_NotFound }, 404);

    evictUser(id, userId);
    await notificationService.discard(userId, id);
    sendToUser(userId, {
      type: ServerEventType.Notification,
      notification: { type: NotificationType.File_Unshared, fileId: id },
    });

    return ctx.body(null, 204);
  });
