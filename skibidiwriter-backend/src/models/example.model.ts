import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const exampleTable = pgTable("example", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  test: text("test"),
});
