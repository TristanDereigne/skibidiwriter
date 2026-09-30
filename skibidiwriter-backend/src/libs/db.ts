import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env";
import { relations } from "@/models";

export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
  },
  relations,
});
