import { db } from "@/libs/db";
import { user } from "@/models";
import { eq } from "drizzle-orm";

export const updateUserEmail = async (oldEmail: string, email: string) => {
  try {
    await db.update(user).set({ email: email }).where(eq(user.email, oldEmail));
  } catch (error) {
    throw error;
  }
};
