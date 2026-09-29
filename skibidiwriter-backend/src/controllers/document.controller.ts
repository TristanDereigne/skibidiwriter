import documentService from "@/services/document.service";
import { Hono } from "hono";
import { validator } from "hono/validator";
import {
  CreateDocumentSchema,
  RenameDocumentSchema,
  type DocumentDTO,
} from "skibidiwriter-shared";
import z from "zod";

function toDTO(row: { id: string; name: string; updatedAt: Date }) {
  return {
    id: row.id,
    name: row.name,
    updatedAt: row.updatedAt.toISOString(),
  } satisfies DocumentDTO;
}

export const documentController = new Hono()
  .get("/", async (ctx) => {
    const rows = await documentService.findAll();

    return ctx.json(rows.map(toDTO));
  })
  .post("/", async (ctx) => {
    const body = CreateDocumentSchema.safeParse(
      await ctx.req.json().catch(() => null)
    );
    if (!body.success) return ctx.json({ error: "Invalid document" }, 400);

    const row = await documentService.create(body.data.name);

    return ctx.json(toDTO(row), 201);
  })
  .patch(
    "/:id",
    validator("json", (value, ctx) => {
      const body = RenameDocumentSchema.safeParse(value);
      if (!body.success) return ctx.json({ error: "Invalid document" }, 400);

      return body.data;
    }),
    async (ctx) => {
      const id = z.uuid().safeParse(ctx.req.param("id"));
      if (!id.success) return ctx.json({ error: "Invalid document id" }, 400);

      const row = await documentService.rename(
        id.data,
        ctx.req.valid("json").name
      );
      if (!row) return ctx.json({ error: "Document not found" }, 404);

      return ctx.json(toDTO(row), 200);
    }
  )
  .delete("/:id", async (ctx) => {
    const id = z.uuid().safeParse(ctx.req.param("id"));
    if (!id.success) return ctx.json({ error: "Invalid document id" }, 400);

    const row = await documentService.remove(id.data);
    if (!row) return ctx.json({ error: "Document not found" }, 404);

    return ctx.body(null, 204);
  });
