import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { NotificationDTO } from "skibidiwriter-shared";
import { user } from "./auth.model";
import { fileTable } from "./file.model";

export const notificationTable = pgTable(
  "notification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fileId: uuid("file_id")
      .notNull()
      .references(() => fileTable.id, { onDelete: "cascade" }),
    payload: jsonb("payload").$type<NotificationDTO>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("notification_user_idx").on(table.userId, table.createdAt)],
);
