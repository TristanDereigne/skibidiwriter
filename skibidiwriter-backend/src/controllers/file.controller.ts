import type { AuthEnv } from "@/libs/require-auth";
import { IdParamSchema, validate } from "@/libs/validation";
import { toFileDTO } from "@/mappers/file.mapper";
import fileService from "@/services/file.service";
import folderService from "@/services/folder.service";
import { Hono } from "hono";
import {
  CreateDocumentSchema,
  ErrorCode,
  MoveFileSchema,
  RenameSchema,
} from "skibidiwriter-shared";
import z from "zod";
import { fileTransferController } from "./file-transfer.controller";

const ListQuerySchema = z.object({ folderId: z.uuid().optional() });

export const fileController = new Hono<AuthEnv>()
  .route("/", fileTransferController)
  .get("/", validate("query", ListQuerySchema), async (ctx) => {
    const { folderId = null } = ctx.req.valid("query");
    const rows = await fileService.findInFolder(folderId, ctx.get("userId"));

    return ctx.json(rows.map(toFileDTO));
  })
  .get("/:id", validate("param", IdParamSchema), async (ctx) => {
    const row = await fileService.findById(
      ctx.req.valid("param").id,
      ctx.get("userId"),
    );
    if (!row) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

    return ctx.json(toFileDTO(row), 200);
  })
  .post("/documents", validate("json", CreateDocumentSchema), async (ctx) => {
    const userId = ctx.get("userId");
    const { name, folderId, content } = ctx.req.valid("json");

    const folderExists =
      !folderId || (await folderService.exists(folderId, userId));
    if (!folderExists)
      return ctx.json({ code: ErrorCode.Folder_NotFound }, 404);

    const nameTaken = await fileService.nameTaken(name, folderId, userId);
    if (nameTaken) return ctx.json({ code: ErrorCode.Name_AlreadyInUse }, 409);

    const row = await fileService.createDocument(
      name,
      folderId,
      userId,
      content,
    );

    return ctx.json(toFileDTO(row), 201);
  })
  .patch(
    "/:id",
    validate("param", IdParamSchema),
    validate("json", RenameSchema),
    async (ctx) => {
      const userId = ctx.get("userId");
      const { id } = ctx.req.valid("param");
      const { name } = ctx.req.valid("json");

      const file = await fileService.findById(id, userId);
      if (!file) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

      const nameTaken = await fileService.nameTaken(
        name,
        file.folderId,
        userId,
        id,
      );
      if (nameTaken)
        return ctx.json({ code: ErrorCode.Name_AlreadyInUse }, 409);

      const row = await fileService.rename(id, name, userId);
      if (!row) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

      return ctx.json(toFileDTO(row), 200);
    },
  )
  .patch(
    "/:id/move",
    validate("param", IdParamSchema),
    validate("json", MoveFileSchema),
    async (ctx) => {
      const userId = ctx.get("userId");
      const { folderId } = ctx.req.valid("json");

      const folderExists =
        !folderId || (await folderService.exists(folderId, userId));
      if (!folderExists)
        return ctx.json({ code: ErrorCode.Folder_NotFound }, 404);

      const { id } = ctx.req.valid("param");

      const file = await fileService.findById(id, userId);
      if (!file) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

      const nameTaken = await fileService.nameTaken(
        file.name,
        folderId,
        userId,
        id,
      );
      if (nameTaken)
        return ctx.json({ code: ErrorCode.Name_AlreadyInUse }, 409);

      const row = await fileService.move(id, folderId, userId);
      if (!row) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

      return ctx.json(toFileDTO(row), 200);
    },
  )
  .delete("/:id", validate("param", IdParamSchema), async (ctx) => {
    const row = await fileService.remove(
      ctx.req.valid("param").id,
      ctx.get("userId"),
    );
    if (!row) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

    return ctx.body(null, 204);
  });
