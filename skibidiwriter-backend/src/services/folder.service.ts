import { db } from "@/libs/db";
import documentService from "@/services/document.service";
import { documentTable, folderTable } from "@/models";
import { eqOrNull } from "@/libs/sql";
import { eq, sql } from "drizzle-orm";

async function findInFolder(parentId: string | null) {
  return await db
    .select()
    .from(folderTable)
    .where(eqOrNull(folderTable.parentId, parentId));
}

async function exists(id: string) {
  const [row] = await db
    .select({ id: folderTable.id })
    .from(folderTable)
    .where(eq(folderTable.id, id));

  return !!row;
}

async function path(id: string) {
  const result = await db.execute<{
    id: string;
    name: string;
    parent_id: string | null;
    updated_at: Date;
  }>(sql`
    WITH RECURSIVE ancestors AS (
      SELECT id, name, parent_id, updated_at, ARRAY[id] AS visited
      FROM ${folderTable} WHERE id = ${id}
      UNION ALL
      SELECT f.id, f.name, f.parent_id, f.updated_at, a.visited || f.id
      FROM ${folderTable} f
      JOIN ancestors a ON f.id = a.parent_id
      WHERE NOT f.id = ANY(a.visited)
    )
    SELECT id, name, parent_id, updated_at
    FROM ancestors ORDER BY cardinality(visited) DESC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    parentId: row.parent_id,
    updatedAt: new Date(row.updated_at),
  }));
}

async function create(name: string, parentId: string | null) {
  const [row] = await db
    .insert(folderTable)
    .values({ name, parentId })
    .returning();

  return row!;
}

async function rename(id: string, name: string) {
  const [row] = await db
    .update(folderTable)
    .set({ name })
    .where(eq(folderTable.id, id))
    .returning();

  return row;
}

async function documentIdsWithin(id: string) {
  const result = await db.execute<{ id: string }>(sql`
    WITH RECURSIVE tree AS (
      SELECT id FROM ${folderTable} WHERE id = ${id}
      UNION
      SELECT f.id FROM ${folderTable} f JOIN tree t ON f.parent_id = t.id
    )
    SELECT d.id FROM ${documentTable} d WHERE d.folder_id IN (SELECT id FROM tree)
  `);

  return result.rows.map((row) => row.id);
}

async function remove(id: string) {
  const documentIds = await documentIdsWithin(id);

  const [row] = await db
    .delete(folderTable)
    .where(eq(folderTable.id, id))
    .returning({ id: folderTable.id });

  if (row) await documentService.forget(documentIds);

  return row;
}

export default {
  findInFolder,
  exists,
  path,
  create,
  rename,
  remove,
};
