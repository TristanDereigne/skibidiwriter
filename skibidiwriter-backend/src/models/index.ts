import { defineRelations } from "drizzle-orm";
import { documentTable } from "./document.model";
import { exampleTable } from "./example.model";
import { account, session, user, verification } from "./auth.model";

export const relations = defineRelations({
  documentTable,
  exampleTable,
  user,
  session,
  account,
  verification
});

export {
  documentTable,
  exampleTable,
  user,
  session,
  account,
  verification
};
