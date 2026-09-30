import type { AuthEnv } from "@/libs/require-auth";
import { IdParamSchema, validate } from "@/libs/validation";
import documentService from "@/services/document.service";
import folderService from "@/services/folder.service";
import { Hono } from "hono";
import {
  CreateDocumentSchema,
  RenameSchema,
  type DocumentDTO,
} from "skibidiwriter-shared";
import z from "zod";

const ListQuerySchema = z.object({ folderId: z.uuid().optional() });

function toDTO(row: Omit<DocumentDTO, "updatedAt"> & { updatedAt: Date }) {
  return {
    id: row.id,
    name: row.name,
    folderId: row.folderId,
    updatedAt: row.updatedAt.toISOString(),
  } satisfies DocumentDTO;
}

export const documentController = new Hono<AuthEnv>()
  .get("/", validate("query", ListQuerySchema), async (ctx) => {
    const { folderId = null } = ctx.req.valid("query");
    const rows = await documentService.findInFolder(
      folderId,
      ctx.get("userId"),
    );

    return ctx.json(rows.map(toDTO));
  })
  .get("/:id", validate("param", IdParamSchema), async (ctx) => {
    const row = await documentService.findById(
      ctx.req.valid("param").id,
      ctx.get("userId"),
    );
    if (!row) return ctx.json({ error: "Document not found" }, 404);

    return ctx.json(toDTO(row), 200);
  })
  .post("/", validate("json", CreateDocumentSchema), async (ctx) => {
    const { name, folderId, content } = ctx.req.valid("json");

    const folderExists =
      !folderId || (await folderService.exists(folderId, ctx.get("userId")));
    if (!folderExists) {
      return ctx.json({ error: "Folder not found" }, 404);
    }

    const row = await documentService.create(
      name,
      folderId,
      ctx.get("userId"),
      content,
    );

    return ctx.json(toDTO(row), 201);
  })
  .patch(
    "/:id",
    validate("param", IdParamSchema),
    validate("json", RenameSchema),
    async (ctx) => {
      const row = await documentService.rename(
        ctx.req.valid("param").id,
        ctx.req.valid("json").name,
        ctx.get("userId"),
      );
      if (!row) return ctx.json({ error: "Document not found" }, 404);

      return ctx.json(toDTO(row), 200);
    },
  )
  .delete("/:id", validate("param", IdParamSchema), async (ctx) => {
    const row = await documentService.remove(
      ctx.req.valid("param").id,
      ctx.get("userId"),
    );
    if (!row) return ctx.json({ error: "Document not found" }, 404);

    return ctx.body(null, 204);
  });
