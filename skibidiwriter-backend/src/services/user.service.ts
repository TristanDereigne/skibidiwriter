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
    .select()
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

const updateUserEmail = async (oldEmail: string, email: string) => {
  try {
    await db.update(user).set({ email: email }).where(eq(user.email, oldEmail));
  } catch (error) {
    console.log("updateUserEmail error: ", error);
    throw error;
  }
};

const getUsers = async () => {
  try {
    const response: UsersDto[] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
      })
      .from(user);

    if (response) {
      return response;
    } else {
      return null;
    }
  } catch (error) {
    console.log("getUsers error: ", error);
    throw error;
  }
};

const checkTwoFactorEnabled = async (email: string) => {
  try {
    const response: { twoFactorEnabled: boolean | null }[] = await db
      .select({ twoFactorEnabled: user.twoFactorEnabled })
      .from(user)
      .where(eq(user.email, email));
    if (response[0]) {
      return response[0]?.twoFactorEnabled;
    } else {
      return null;
    }
  } catch (error) {
    console.log("checkTwoFactorEnabled error: ", error);
    throw error;
  }
};

export default {
  updateUserEmail,
  getUsers,
  checkTwoFactorEnabled,
  findUsersByName,
  existAll,
};
