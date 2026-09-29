import { defineRelations } from "drizzle-orm";
import { documentTable } from "./document.model";
import { folderTable } from "./folder.model";
import { account, session, user, verification } from "./auth.model";

export const relations = defineRelations({
  documentTable,
  folderTable,
  user,
  session,
  account,
  verification,
});

export { documentTable, folderTable, user, session, account, verification };
