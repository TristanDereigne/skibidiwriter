import { db } from "@/libs/db";
import { eqOrNull } from "@/libs/sql";
import { fileTable } from "@/models";
import { and, eq } from "drizzle-orm";

const summarySelect = {
  id: fileTable.id,
  name: fileTable.name,
  folderId: fileTable.folderId,
  mimeType: fileTable.mimeType,
  size: fileTable.size,
  updatedAt: fileTable.updatedAt,
};

function accessibleTo(userId: string) {
  return eq(fileTable.ownerId, userId);
}

async function findInFolder(folderId: string | null, userId: string) {
  return await db
    .select(summarySelect)
    .from(fileTable)
    .where(and(eqOrNull(fileTable.folderId, folderId), accessibleTo(userId)));
}

async function findContent(id: string, userId: string) {
  const [row] = await db
    .select({
      name: fileTable.name,
      mimeType: fileTable.mimeType,
      data: fileTable.data,
    })
    .from(fileTable)
    .where(and(eq(fileTable.id, id), accessibleTo(userId)));

  return row;
}

async function create(
  file: { name: string; mimeType: string; data: Buffer },
  folderId: string | null,
  userId: string,
) {
  const [row] = await db
    .insert(fileTable)
    .values({ ...file, size: file.data.length, folderId, ownerId: userId })
    .returning(summarySelect);

  return row!;
}

async function rename(id: string, name: string, userId: string) {
  const [row] = await db
    .update(fileTable)
    .set({ name })
    .where(and(eq(fileTable.id, id), accessibleTo(userId)))
    .returning(summarySelect);

  return row;
}

async function move(id: string, folderId: string | null, userId: string) {
  const [row] = await db
    .update(fileTable)
    .set({ folderId })
    .where(and(eq(fileTable.id, id), accessibleTo(userId)))
    .returning(summarySelect);

  return row;
}

async function remove(id: string, userId: string) {
  const [row] = await db
    .delete(fileTable)
    .where(and(eq(fileTable.id, id), accessibleTo(userId)))
    .returning({ id: fileTable.id });

  return row;
}

export default {
  findInFolder,
  findContent,
  create,
  rename,
  move,
  remove,
};
