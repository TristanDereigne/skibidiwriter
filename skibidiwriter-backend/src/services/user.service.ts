import { db } from "@/libs/db";
import { user } from "@/models";
import { eq } from "drizzle-orm";

export const updateUserEmail = async (oldEmail: string, email: string) => {
  try {
    await db.update(user).set({ email: email }).where(eq(user.email, oldEmail));
  } catch (error) {
    console.log("updateUserEmail error: ", error);
    throw error;
  }
};

export const checkTwoFactorEnabled = async (email: string) => {
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
