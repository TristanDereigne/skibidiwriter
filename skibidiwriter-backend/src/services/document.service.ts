import { db } from "@/libs/db";
import { documentTable } from "@/models";
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

export default {
  create,
  operations,
  apply,
  findAll,
};
