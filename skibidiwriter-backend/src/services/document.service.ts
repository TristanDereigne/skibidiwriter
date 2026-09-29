import { db } from "@/libs/db";
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

export default {
  operations,
  apply,
  findAll,
};
