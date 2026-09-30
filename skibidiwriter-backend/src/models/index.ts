import { defineRelations } from "drizzle-orm";
import * as authModel from "./auth.model";
import * as documentModel from "./document.model";
import * as folderModel from "./folder.model";

export * from "./auth.model";
export * from "./document.model";
export * from "./folder.model";

export const relations = defineRelations({
  ...authModel,
  ...documentModel,
  ...folderModel,
});
