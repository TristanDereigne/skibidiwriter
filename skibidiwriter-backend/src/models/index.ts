import { defineRelations } from "drizzle-orm";
import { documentTable } from "./document.model";
import { account, session, user, verification } from "./auth.model";

export const relations = defineRelations({
  documentTable,
  user,
  session,
  account,
  verification
});

export {
  documentTable,
  user,
  session,
  account,
  verification
};
