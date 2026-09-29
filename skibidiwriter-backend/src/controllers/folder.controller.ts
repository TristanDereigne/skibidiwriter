import { IdParamSchema, validate } from "@/libs/validation";
import folderService from "@/services/folder.service";
import { Hono } from "hono";
import {
  CreateFolderSchema,
  RenameSchema,
  type FolderDTO,
} from "skibidiwriter-shared";
import z from "zod";

const ListQuerySchema = z.object({ parentId: z.uuid().optional() });

function toDTO(row: Omit<FolderDTO, "updatedAt"> & { updatedAt: Date }) {
  return {
    id: row.id,
    name: row.name,
    parentId: row.parentId,
    updatedAt: row.updatedAt.toISOString(),
  } satisfies FolderDTO;
}

export const folderController = new Hono()
  .get("/", validate("query", ListQuerySchema), async (ctx) => {
    const { parentId = null } = ctx.req.valid("query");
    const rows = await folderService.findInFolder(parentId);

    return ctx.json(rows.map(toDTO));
  })
  .get("/:id/path", validate("param", IdParamSchema), async (ctx) => {
    const rows = await folderService.path(ctx.req.valid("param").id);
    if (rows.length === 0) return ctx.json({ error: "Folder not found" }, 404);

    return ctx.json(rows.map(toDTO), 200);
  })
  .post("/", validate("json", CreateFolderSchema), async (ctx) => {
    const { name, parentId } = ctx.req.valid("json");

    if (parentId && !(await folderService.exists(parentId))) {
      return ctx.json({ error: "Parent folder not found" }, 404);
    }

    const row = await folderService.create(name, parentId);

    return ctx.json(toDTO(row), 201);
  })
  .patch(
    "/:id",
    validate("param", IdParamSchema),
    validate("json", RenameSchema),
    async (ctx) => {
      const row = await folderService.rename(
        ctx.req.valid("param").id,
        ctx.req.valid("json").name,
      );
      if (!row) return ctx.json({ error: "Folder not found" }, 404);

      return ctx.json(toDTO(row), 200);
    },
  )
  .delete("/:id", validate("param", IdParamSchema), async (ctx) => {
    const row = await folderService.remove(ctx.req.valid("param").id);
    if (!row) return ctx.json({ error: "Folder not found" }, 404);

    return ctx.body(null, 204);
  });
