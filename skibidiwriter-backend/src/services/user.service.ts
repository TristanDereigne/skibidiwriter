import { db } from "@/libs/db";
import { user } from "@/models";
import { and, asc, eq, ilike, inArray, ne } from "drizzle-orm";
import { type UsersDto } from "skibidiwriter-shared";

async function findUsersByName(
  name: string,
  limit: number,
  excludedUserId: string,
) {
  return await db
    .select({ id: user.id, name: user.name })
    .from(user)
    .where(and(ilike(user.name, `%${name}%`), ne(user.id, excludedUserId)))
    .orderBy(asc(user.name))
    .limit(limit);
}

async function existAll(ids: string[]) {
  if (!ids.length) return true;

  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(inArray(user.id, ids));

  return rows.length === ids.length;
}

async function updateUserEmail(oldEmail: string, email: string) {
  await db.update(user).set({ email }).where(eq(user.email, oldEmail));
}

async function getUsers(): Promise<UsersDto[]> {
  return await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      banned: user.banned,
    })
    .from(user);
}

async function checkTwoFactorEnabled(email: string) {
  const [row] = await db
    .select({ twoFactorEnabled: user.twoFactorEnabled })
    .from(user)
    .where(eq(user.email, email));

  return !!row?.twoFactorEnabled;
}

export default {
  updateUserEmail,
  getUsers,
  checkTwoFactorEnabled,
  findUsersByName,
  existAll,
};
