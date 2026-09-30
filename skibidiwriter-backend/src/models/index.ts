import { defineRelations } from "drizzle-orm";
import * as authModel from "./auth.model";
import * as fileModel from "./file.model";
import * as folderModel from "./folder.model";

export * from "./auth.model";
export * from "./file.model";
export * from "./folder.model";

export const relations = defineRelations({
  ...authModel,
  ...fileModel,
  ...folderModel,
});
