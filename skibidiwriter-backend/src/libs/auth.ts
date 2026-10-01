import { env } from "@/libs/env";
import * as schemas from "@/models";

import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { admin, twoFactor } from "better-auth/plugins";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { UsernameSchema } from "skibidiwriter-shared";
import { db } from "./db";

export const auth = betterAuth({
  appName: "SkibidiWriter",
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schemas,
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          const username = UsernameSchema.safeParse(newUser.name);
          if (!username.success) {
            throw new APIError("BAD_REQUEST", {
              message: username.error.issues[0]?.message,
            });
          }

          return { data: { ...newUser, name: username.data } };
        },
      },
    },
  },
  trustedOrigins: [env.FRONTEND_URL_NO_SLASH],
  plugins: [
      twoFactor(),
      admin({
      defaultRole: "user",
      adminRoles: ["admin"],
      adminUserIds: [env.ADMIN_ID]
      })
  ],
});
