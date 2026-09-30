import type { AuthEnv } from "@/libs/require-auth";
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
  .post(
    "/",
    bodyLimit({
      maxSize: MAX_FILE_SIZE_BYTES + MULTIPART_OVERHEAD,
      onError: (ctx) => ctx.json({ code: ErrorCode.File_TooLarge }, 413),
    }),
    validate("form", UploadFormSchema),
    async (ctx) => {
      const userId = ctx.get("userId");
      const { file, folderId = null } = ctx.req.valid("form");

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return ctx.json({ code: ErrorCode.File_TooLarge }, 413);
      }

      const folderExists =
        !folderId || (await folderService.exists(folderId, userId));
      if (!folderExists)
        return ctx.json({ code: ErrorCode.Folder_NotFound }, 404);

      const name = NameSchema.safeParse(file.name.slice(0, 255));
      if (!name.success)
        return ctx.json({ code: ErrorCode.File_NameInvalid }, 400);

      const nameTaken = await fileService.nameTaken(
        name.data,
        folderId,
        userId,
      );
      if (nameTaken)
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
