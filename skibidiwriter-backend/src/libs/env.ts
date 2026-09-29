import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});

import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["production", "development"]).default("development"),
  PORT: z.coerce.number(),
  DATABASE_URL: z.url(),
  FRONTEND_URL: z.url(),
  FRONTEND_URL_NO_SLASH: z.url(),
});

export const env = schema.parse(process.env);
