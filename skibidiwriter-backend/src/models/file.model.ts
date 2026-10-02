import { sql } from "drizzle-orm";
import {
  check,
  customType,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { FILE_KINDS, Snapshot } from "skibidiwriter-shared";
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
    snapshot: jsonb("snapshot").$type<Snapshot>(),
    folderId: uuid("folder_id").references(() => folderTable.id, {
      onDelete: "cascade",
    }),
    ownerId: text("owner_id").references(() => user.id, {
      onDelete: "cascade",
    }),
    lastModifiedById: text("last_modified_by_id").references(() => user.id, {
      onDelete: "set null",
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
      sql`(${table.kind} = 'document' AND ${table.snapshot} IS NOT NULL AND ${table.data} IS NULL)
        OR (${table.kind} = 'upload' AND ${table.data} IS NOT NULL AND ${table.snapshot} IS NULL)`,
    ),
    uniqueIndex("file_unique_name_in_folder")
      .on(table.ownerId, table.folderId, sql`lower(${table.name})`)
      .where(sql`${table.folderId} IS NOT NULL`),
    uniqueIndex("file_unique_name_at_root")
      .on(table.ownerId, sql`lower(${table.name})`)
      .where(sql`${table.folderId} IS NULL`),
  ],
);

export type FileRow = typeof fileTable.$inferSelect;
