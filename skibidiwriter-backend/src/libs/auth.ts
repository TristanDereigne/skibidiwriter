import { env } from "@/libs/env";
import * as schemas from "@/models";

import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins"

import { drizzleAdapter } from "better-auth/adapters/drizzle";
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
  trustedOrigins: [env.FRONTEND_URL_NO_SLASH],
  plugins: [
    twoFactor()
  ]
});
