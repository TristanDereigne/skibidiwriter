import { defineRelations } from "drizzle-orm";
import { exampleTable } from "./example.model";
import { account, session, user, verification } from "./auth.model";

export const relations = defineRelations({
  exampleTable,
  user,
  session,
  account,
  verification
});

export {
  exampleTable,
  user,
  session,
  account,
  verification
};
