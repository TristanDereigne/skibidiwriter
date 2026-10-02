import type { AuthEnv } from "@/middleware/session.middleware";
import { IdParamSchema, validate } from "@/libs/validation";
import { toFileDTO } from "@/mappers/file.mapper";
import fileService from "@/services/file.service";
import folderService from "@/services/folder.service";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import {
  ErrorCode,
  MAX_FILE_SIZE_BYTES,
  NameSchema,
} from "skibidiwriter-shared";
import z from "zod";

const MULTIPART_OVERHEAD = 64 * 1024;
const MIME_TYPE = /^[\w.+-]+\/[\w.+-]+$/;

const UploadFormSchema = z.object({
  file: z.instanceof(File),
  folderId: z.uuid().optional(),
});

const ReplaceFormSchema = z.object({ file: z.instanceof(File) });

const uploadBodyLimit = bodyLimit({
  maxSize: MAX_FILE_SIZE_BYTES + MULTIPART_OVERHEAD,
  onError: (ctx) => ctx.json({ code: ErrorCode.File_TooLarge }, 413),
});

function toMimeType(type: string) {
  const essence = type.split(";")[0]!.trim().toLowerCase();

  return MIME_TYPE.test(essence) ? essence : "application/octet-stream";
}

export const fileTransferController = new Hono<AuthEnv>()
  .get("/:id/content", validate("param", IdParamSchema), async (ctx) => {
    const row = await fileService.content(
      ctx.req.valid("param").id,
      ctx.get("userId"),
    );
    if (!row) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

    return ctx.body(new Uint8Array(row.data), 200, {
      "Content-Type": row.mimeType,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(row.name)}`,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox",
    });
  })
  .put(
    "/:id/content",
    uploadBodyLimit,
    validate("param", IdParamSchema),
    validate("form", ReplaceFormSchema),
    async (ctx) => {
      const userId = ctx.get("userId");
      const { id } = ctx.req.valid("param");
      const { file } = ctx.req.valid("form");

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return ctx.json({ code: ErrorCode.File_TooLarge }, 413);
      }

      const existing = await fileService.findOwnedById(id, userId);
      if (!existing) return ctx.json({ code: ErrorCode.File_NotFound }, 404);
      if (existing.kind !== "upload") {
        return ctx.json({ code: ErrorCode.File_NotReplaceable }, 409);
      }

      const row = await fileService.replaceUpload(
        id,
        {
          mimeType: toMimeType(file.type),
          data: Buffer.from(await file.arrayBuffer()),
        },
        userId,
      );
      if (!row) return ctx.json({ code: ErrorCode.File_NotFound }, 404);

      return ctx.json(toFileDTO(row), 200);
    },
  )
  .post(
    "/",
    uploadBodyLimit,
    validate("form", UploadFormSchema),
    async (ctx) => {
      const userId = ctx.get("userId");
      const { file, folderId = null } = ctx.req.valid("form");

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return ctx.json({ code: ErrorCode.File_TooLarge }, 413);
      }

      const isFolderFound =
        !folderId || (await folderService.exists(folderId, userId));
      if (!isFolderFound)
        return ctx.json({ code: ErrorCode.Folder_NotFound }, 404);

      const name = NameSchema.safeParse(file.name.slice(0, 255));
      if (!name.success)
        return ctx.json({ code: ErrorCode.File_NameInvalid }, 400);

      const isNameTaken = await fileService.isNameTaken(
        name.data,
        folderId,
        userId,
      );
      if (isNameTaken)
        return ctx.json({ code: ErrorCode.Name_AlreadyInUse }, 409);

      const row = await fileService.createUpload(
        {
          name: name.data,
          mimeType: toMimeType(file.type),
          data: Buffer.from(await file.arrayBuffer()),
        },
        folderId,
        userId,
      );

      return ctx.json(toFileDTO(row), 201);
    },
  );
