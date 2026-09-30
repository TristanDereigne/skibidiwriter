import type { AuthEnv } from "@/libs/require-auth";
import { IdParamSchema, validate } from "@/libs/validation";
import fileService from "@/services/file.service";
import folderService from "@/services/folder.service";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import {
  MAX_FILE_SIZE_BYTES,
  MoveFileSchema,
  NameSchema,
  RenameSchema,
  type FileDTO,
} from "skibidiwriter-shared";
import z from "zod";

const MULTIPART_OVERHEAD = 64 * 1024;
const MIME_TYPE = /^[\w.+-]+\/[\w.+-]+$/;

const ListQuerySchema = z.object({ folderId: z.uuid().optional() });

const UploadFormSchema = z.object({
  file: z.instanceof(File),
  folderId: z.uuid().optional(),
});

function toMimeType(type: string) {
  const essence = type.split(";")[0]!.trim().toLowerCase();

  return MIME_TYPE.test(essence) ? essence : "application/octet-stream";
}

function toDTO(row: Omit<FileDTO, "updatedAt"> & { updatedAt: Date }) {
  return {
    id: row.id,
    name: row.name,
    folderId: row.folderId,
    mimeType: row.mimeType,
    size: row.size,
    updatedAt: row.updatedAt.toISOString(),
  } satisfies FileDTO;
}

export const fileController = new Hono<AuthEnv>()
  .get("/", validate("query", ListQuerySchema), async (ctx) => {
    const { folderId = null } = ctx.req.valid("query");
    const rows = await fileService.findInFolder(folderId, ctx.get("userId"));

    return ctx.json(rows.map(toDTO));
  })
  .get("/:id/content", validate("param", IdParamSchema), async (ctx) => {
    const row = await fileService.findContent(
      ctx.req.valid("param").id,
      ctx.get("userId"),
    );
    if (!row) return ctx.json({ error: "File not found" }, 404);

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
      onError: (ctx) => ctx.json({ error: "File too large" }, 413),
    }),
    validate("form", UploadFormSchema),
    async (ctx) => {
      const userId = ctx.get("userId");
      const { file, folderId = null } = ctx.req.valid("form");

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return ctx.json({ error: "File too large" }, 413);
      }

      const folderExists =
        !folderId || (await folderService.exists(folderId, userId));
      if (!folderExists) return ctx.json({ error: "Folder not found" }, 404);

      const name = NameSchema.safeParse(file.name.slice(0, 255));
      if (!name.success) return ctx.json({ error: "Invalid file name" }, 400);

      const row = await fileService.create(
        {
          name: name.data,
          mimeType: toMimeType(file.type),
          data: Buffer.from(await file.arrayBuffer()),
        },
        folderId,
        userId,
      );

      return ctx.json(toDTO(row), 201);
    },
  )
  .patch(
    "/:id",
    validate("param", IdParamSchema),
    validate("json", RenameSchema),
    async (ctx) => {
      const row = await fileService.rename(
        ctx.req.valid("param").id,
        ctx.req.valid("json").name,
        ctx.get("userId"),
      );
      if (!row) return ctx.json({ error: "File not found" }, 404);

      return ctx.json(toDTO(row), 200);
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
      if (!folderExists) return ctx.json({ error: "Folder not found" }, 404);

      const row = await fileService.move(
        ctx.req.valid("param").id,
        folderId,
        userId,
      );
      if (!row) return ctx.json({ error: "File not found" }, 404);

      return ctx.json(toDTO(row), 200);
    },
  )
  .delete("/:id", validate("param", IdParamSchema), async (ctx) => {
    const row = await fileService.remove(
      ctx.req.valid("param").id,
      ctx.get("userId"),
    );
    if (!row) return ctx.json({ error: "File not found" }, 404);

    return ctx.body(null, 204);
  });
