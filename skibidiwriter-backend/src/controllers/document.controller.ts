import documentService from "@/services/document.service";
import { Hono } from "hono";
import { DocumentDTO } from "skibidiwriter-shared";

export const documentController = new Hono().get("/", async (ctx) => {
  const rows = await documentService.findAll();

  const documents = rows.map((row) => ({
    id: row.id,
    name: row.name,
    updatedAt: row.updatedAt.toISOString(),
  })) satisfies DocumentDTO[];

  return ctx.json(documents);
});
