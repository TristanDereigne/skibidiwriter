import { db } from "@/libs/db";
import { fileShareTable } from "@/models";

async function createMany(fileId: string, userIds: string[]) {
  if (!userIds.length) return [];

  return await db
    .insert(fileShareTable)
    .values(userIds.map((userId) => ({ fileId, userId })))
    .onConflictDoNothing()
    .returning();
}

export default { createMany };
