import { env } from "./src/libs/env";

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/models/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
