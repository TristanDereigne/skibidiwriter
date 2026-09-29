import documentService from "@/services/document.service";
import { Hono } from "hono";
import { CreateDocumentSchema, type DocumentDTO } from "skibidiwriter-shared";

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
      await ctx.req.json().catch(() => null),
    );
    if (!body.success) return ctx.json({ error: "Invalid document" }, 400);

    const row = await documentService.create(body.data.name);

    return ctx.json(toDTO(row), 201);
  });
