import { db } from "@/libs/db";
import { user } from "@/models";
import { eq, ilike } from "drizzle-orm";

const updateUserEmail = async (oldEmail: string, email: string) => {
  try {
    await db.update(user).set({ email: email }).where(eq(user.email, oldEmail));
  } catch (error) {
    console.log("updateUserEmail error: ", error);
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

async function findManyByName(search: string, limit: number) {
  return await db
    .select()
    .from(user)
    .where(ilike(user.name, `%${search}%`))
    .orderBy(user.name)
    .limit(limit);
}

export default {
  updateUserEmail,
  checkTwoFactorEnabled,
  findManyByName,
};
