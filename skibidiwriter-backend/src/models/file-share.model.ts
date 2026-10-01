import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth.model";
import { fileTable } from "./file.model";

export const fileShareTable = pgTable(
  "file_share",
  {
    fileId: uuid("file_id")
      .notNull()
      .references(() => fileTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.fileId, table.userId] }),
    index("file_share_user_idx").on(table.userId),
  ],
);

export type FileShareRow = typeof fileShareTable.$inferSelect;
