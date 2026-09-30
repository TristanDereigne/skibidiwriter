import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { user } from "./auth.model";

export const folderTable = pgTable(
  "folder",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    parentId: uuid("parent_id").references((): AnyPgColumn => folderTable.id, {
      onDelete: "cascade",
    }),
    ownerId: text("owner_id").references(() => user.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("folder_unique_name_in_parent")
      .on(table.ownerId, table.parentId, sql`lower(${table.name})`)
      .where(sql`${table.parentId} IS NOT NULL`),
    uniqueIndex("folder_unique_name_at_root")
      .on(table.ownerId, sql`lower(${table.name})`)
      .where(sql`${table.parentId} IS NULL`),
  ],
);

export type FolderRow = typeof folderTable.$inferSelect;
