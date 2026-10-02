import { db } from "@/libs/db";
import { fileShareTable, user } from "@/models";
import { and, asc, eq } from "drizzle-orm";

async function createMany(fileId: string, userIds: string[]) {
  if (!userIds.length) return [];

  return await db
    .insert(fileShareTable)
    .values(userIds.map((userId) => ({ fileId, userId })))
    .onConflictDoNothing()
    .returning();
}

async function findRecipients(fileId: string) {
  return await db
    .select({ id: user.id, name: user.name })
    .from(fileShareTable)
    .innerJoin(user, eq(user.id, fileShareTable.userId))
    .where(eq(fileShareTable.fileId, fileId))
    .orderBy(asc(user.name));
}

async function remove(fileId: string, userId: string) {
  const [row] = await db
    .delete(fileShareTable)
    .where(
      and(eq(fileShareTable.fileId, fileId), eq(fileShareTable.userId, userId)),
    )
    .returning({ userId: fileShareTable.userId });

  return !!row;
}

export default { createMany, findRecipients, remove };
