import { db } from "@/libs/db";
import fileService from "@/services/file.service";
import { fileTable, folderTable } from "@/models";
import { eqOrNull } from "@/libs/sql";
import { and, asc, eq, ne, sql } from "drizzle-orm";

function ownedBy(userId: string) {
  return eq(folderTable.ownerId, userId);
}

async function findInFolder(parentId: string | null, userId: string) {
  return await db
    .select()
    .from(folderTable)
    .where(and(eqOrNull(folderTable.parentId, parentId), ownedBy(userId)))
    .orderBy(asc(sql`lower(${folderTable.name})`));
}

async function findById(id: string, userId: string) {
  const [row] = await db
    .select()
    .from(folderTable)
    .where(and(eq(folderTable.id, id), ownedBy(userId)));

  return row;
}

async function exists(id: string, userId: string) {
  const [row] = await db
    .select({ id: folderTable.id })
    .from(folderTable)
    .where(and(eq(folderTable.id, id), ownedBy(userId)));

  return !!row;
}

async function isNameTaken(
  name: string,
  parentId: string | null,
  userId: string,
  exceptId?: string,
) {
  const [row] = await db
    .select({ id: folderTable.id })
    .from(folderTable)
    .where(
      and(
        eqOrNull(folderTable.parentId, parentId),
        ownedBy(userId),
        eq(sql`lower(${folderTable.name})`, sql`lower(${name})`),
        exceptId ? ne(folderTable.id, exceptId) : undefined,
      ),
    );

  return !!row;
}

async function path(id: string, userId: string) {
  const result = await db.execute<{
    id: string;
    name: string;
    parent_id: string | null;
    created_at: Date;
    updated_at: Date;
  }>(sql`
    WITH RECURSIVE ancestors AS (
      SELECT id, name, parent_id, created_at, updated_at, ARRAY[id] AS visited
      FROM ${folderTable} WHERE id = ${id} AND owner_id = ${userId}
      UNION ALL
      SELECT f.id, f.name, f.parent_id, f.created_at, f.updated_at, a.visited || f.id
      FROM ${folderTable} f
      JOIN ancestors a ON f.id = a.parent_id
      WHERE NOT f.id = ANY(a.visited)
    )
    SELECT id, name, parent_id, created_at, updated_at
    FROM ancestors ORDER BY cardinality(visited) DESC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    parentId: row.parent_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}

async function create(name: string, parentId: string | null, userId: string) {
  const [row] = await db
    .insert(folderTable)
    .values({ name, parentId, ownerId: userId })
    .returning();

  return row!;
}

async function rename(id: string, name: string, userId: string) {
  const [row] = await db
    .update(folderTable)
    .set({ name })
    .where(and(eq(folderTable.id, id), ownedBy(userId)))
    .returning();

  return row;
}

async function move(id: string, parentId: string | null, userId: string) {
  const [row] = await db
    .update(folderTable)
    .set({ parentId })
    .where(and(eq(folderTable.id, id), ownedBy(userId)))
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
    SELECT d.id FROM ${fileTable} d
    WHERE d.kind = 'document' AND d.folder_id IN (SELECT id FROM tree)
  `);

  return result.rows.map((row) => row.id);
}

async function stats(id: string, userId: string) {
  const result = await db.execute<{
    file_count: string;
    total_bytes: string;
  }>(sql`
    WITH RECURSIVE tree AS (
      SELECT id FROM ${folderTable} WHERE id = ${id} AND owner_id = ${userId}
      UNION
      SELECT f.id FROM ${folderTable} f JOIN tree t ON f.parent_id = t.id
    )
    SELECT COUNT(d.id) AS file_count, COALESCE(SUM(d.size_bytes), 0) AS total_bytes
    FROM ${fileTable} d
    WHERE d.folder_id IN (SELECT id FROM tree)
  `);

  const row = result.rows[0]!;
  return {
    fileCount: Number(row.file_count),
    totalBytes: Number(row.total_bytes),
  };
}

async function remove(id: string, userId: string) {
  const isOwned = await exists(id, userId);
  if (!isOwned) return;

  const documentIds = await documentIdsWithin(id);

  const [row] = await db
    .delete(folderTable)
    .where(and(eq(folderTable.id, id), ownedBy(userId)))
    .returning({ id: folderTable.id });

  if (row) await fileService.forget(documentIds);

  return row;
}

export default {
  findInFolder,
  findById,
  exists,
  isNameTaken,
  path,
  create,
  rename,
  move,
  stats,
  remove,
};
