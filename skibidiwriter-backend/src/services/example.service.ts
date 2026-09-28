import { db } from "@/libs/db";

async function findAll() {
  return db.query.exampleTable.findMany();
}

export default {
  findAll,
};
