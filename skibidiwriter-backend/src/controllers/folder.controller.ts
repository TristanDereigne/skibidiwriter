import type { AuthEnv } from "@/libs/require-auth";
import { IdParamSchema, validate } from "@/libs/validation";
import type { FolderRow } from "@/models";
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

function toDTO(
  row: Pick<FolderRow, "id" | "name" | "parentId" | "createdAt" | "updatedAt">,
): FolderDTO {
  return {
    id: row.id,
    name: row.name,
    parentId: row.parentId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
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
    if (rows.length === 0)
      return ctx.json({ error: "Dossier introuvable" }, 404);

    return ctx.json(rows.map(toDTO), 200);
  })
  .get("/:id/stats", validate("param", IdParamSchema), async (ctx) => {
    const { id } = ctx.req.valid("param");
    const userId = ctx.get("userId");
    const isOwned = await folderService.exists(id, userId);
    if (!isOwned) return ctx.json({ error: "Dossier introuvable" }, 404);

    const stats = await folderService.stats(id, userId);

    return ctx.json(stats, 200);
  })
  .post("/", validate("json", CreateFolderSchema), async (ctx) => {
    const { name, parentId } = ctx.req.valid("json");

    const parentExists =
      !parentId || (await folderService.exists(parentId, ctx.get("userId")));
    if (!parentExists) {
      return ctx.json({ error: "Dossier parent introuvable" }, 404);
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
      if (!row) return ctx.json({ error: "Dossier introuvable" }, 404);

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
          return ctx.json({ error: "Dossier parent introuvable" }, 404);
        }
        if (ancestors.some((folder) => folder.id === id)) {
          return ctx.json(
            { error: "Impossible de déplacer un dossier dans lui-même" },
            409,
          );
        }
      }

      const row = await folderService.move(id, parentId, userId);
      if (!row) return ctx.json({ error: "Dossier introuvable" }, 404);

      return ctx.json(toDTO(row), 200);
    },
  )
  .delete("/:id", validate("param", IdParamSchema), async (ctx) => {
    const row = await folderService.remove(
      ctx.req.valid("param").id,
      ctx.get("userId"),
    );
    if (!row) return ctx.json({ error: "Dossier introuvable" }, 404);

    return ctx.body(null, 204);
  });
