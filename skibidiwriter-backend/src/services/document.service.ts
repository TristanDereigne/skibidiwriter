import { db } from "@/libs/db";
import { documentTable } from "@/models";
import { eq } from "drizzle-orm";
import { TextCrdt, type DocumentOperation } from "skibidiwriter-shared";

const document = new TextCrdt("server");

function operations() {
  return document.toOperations();
}

function apply(incoming: DocumentOperation[]) {
  return document.apply(incoming);
}

async function findAll() {
  const rows = await db.query.documentTable.findMany();

  return rows;
}

async function create(name: string) {
  const [row] = await db
    .insert(documentTable)
    .values({ name })
    .returning();

  return row!;
}

async function rename(id: string, name: string) {
  const [row] = await db
    .update(documentTable)
    .set({ name })
    .where(eq(documentTable.id, id))
    .returning();

  return row;
}

async function remove(id: string) {
  const [row] = await db
    .delete(documentTable)
    .where(eq(documentTable.id, id))
    .returning({ id: documentTable.id });

  return row;
}

export default {
  rename,
  remove,
  create,
  operations,
  apply,
  findAll,
};
