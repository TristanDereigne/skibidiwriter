import type { AuthEnv } from "@/libs/require-auth";
import { IdParamSchema, validate } from "@/libs/validation";
import folderService from "@/services/folder.service";
import { Hono } from "hono";
import {
  CreateFolderSchema,
  MoveFolderSchema,
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

export const folderController = new Hono<AuthEnv>()
  .get("/", validate("query", ListQuerySchema), async (ctx) => {
    const { parentId = null } = ctx.req.valid("query");
    const rows = await folderService.findInFolder(parentId, ctx.get("userId"));

    return ctx.json(rows.map(toDTO));
  })
  .get("/:id/path", validate("param", IdParamSchema), async (ctx) => {
    const rows = await folderService.path(
      ctx.req.valid("param").id,
      ctx.get("userId"),
    );
    if (rows.length === 0) return ctx.json({ error: "Folder not found" }, 404);

    return ctx.json(rows.map(toDTO), 200);
  })
  .post("/", validate("json", CreateFolderSchema), async (ctx) => {
    const { name, parentId } = ctx.req.valid("json");

    const parentExists =
      !parentId || (await folderService.exists(parentId, ctx.get("userId")));
    if (!parentExists) {
      return ctx.json({ error: "Parent folder not found" }, 404);
    }

    const row = await folderService.create(name, parentId, ctx.get("userId"));

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
        ctx.get("userId"),
      );
      if (!row) return ctx.json({ error: "Folder not found" }, 404);

      return ctx.json(toDTO(row), 200);
    },
  )
  .patch(
    "/:id/move",
    validate("param", IdParamSchema),
    validate("json", MoveFolderSchema),
    async (ctx) => {
      const userId = ctx.get("userId");
      const { id } = ctx.req.valid("param");
      const { parentId } = ctx.req.valid("json");

      if (parentId) {
        const ancestors = await folderService.path(parentId, userId);
        if (ancestors.length === 0) {
          return ctx.json({ error: "Parent folder not found" }, 404);
        }
        if (ancestors.some((folder) => folder.id === id)) {
          return ctx.json({ error: "Cannot move a folder into itself" }, 409);
        }
      }

      const row = await folderService.move(id, parentId, userId);
      if (!row) return ctx.json({ error: "Folder not found" }, 404);

      return ctx.json(toDTO(row), 200);
    },
  )
  .delete("/:id", validate("param", IdParamSchema), async (ctx) => {
    const row = await folderService.remove(
      ctx.req.valid("param").id,
      ctx.get("userId"),
    );
    if (!row) return ctx.json({ error: "Folder not found" }, 404);

    return ctx.body(null, 204);
  });
