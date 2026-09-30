import { sql } from "drizzle-orm";
import {
  check,
  customType,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { FILE_KINDS, type DocumentOperation } from "skibidiwriter-shared";
import { user } from "./auth.model";
import { folderTable } from "./folder.model";

const bytea = customType<{ data: Buffer }>({
  dataType: () => "bytea",
});

export const fileTable = pgTable(
  "file",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    kind: text("kind", { enum: FILE_KINDS }).notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    data: bytea("data"),
    operations: jsonb("operations").$type<DocumentOperation[]>(),
    folderId: uuid("folder_id").references(() => folderTable.id, {
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
    check(
      "file_payload_matches_kind",
      sql`(${table.kind} = 'document' AND ${table.operations} IS NOT NULL AND ${table.data} IS NULL)
        OR (${table.kind} = 'upload' AND ${table.data} IS NOT NULL AND ${table.operations} IS NULL)`,
    ),
  ],
);

export type FileRow = typeof fileTable.$inferSelect;
