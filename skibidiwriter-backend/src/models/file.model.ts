import {
  customType,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth.model";
import { folderTable } from "./folder.model";

const bytea = customType<{ data: Buffer }>({
  dataType: () => "bytea",
});

export const fileTable = pgTable("file", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  folderId: uuid("folder_id").references(() => folderTable.id, {
    onDelete: "cascade",
  }),
  ownerId: text("owner_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
