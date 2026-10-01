import { db } from "@/libs/db";
import { user } from "@/models";
import { eq } from "drizzle-orm";

import { type UsersDto } from "skibidiwriter-shared";

export const updateUserEmail = async (oldEmail: string, email: string) => {
  try {
    await db.update(user).set({ email: email }).where(eq(user.email, oldEmail));
  } catch (error) {
    console.log("updateUserEmail error: ", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response: UsersDto[] = await db
      .select({ name: user.name, email: user.email, role: user.role })
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
