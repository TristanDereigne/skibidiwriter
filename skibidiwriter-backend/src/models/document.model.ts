import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { DocumentOperation } from "skibidiwriter-shared";
import { user } from "./auth.model";
import { folderTable } from "./folder.model";

export const documentTable = pgTable("document", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  folderId: uuid("folder_id").references(() => folderTable.id, {
    onDelete: "cascade",
  }),
  ownerId: text("owner_id").references(() => user.id, { onDelete: "cascade" }),
  operations: jsonb("operations")
    .$type<DocumentOperation[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
