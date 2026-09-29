import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {db} from "./db";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    emailAndPassword: {
        enabled: true,
    },
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
});