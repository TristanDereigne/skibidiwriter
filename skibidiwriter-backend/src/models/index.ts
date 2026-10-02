import { defineRelations } from "drizzle-orm";
import * as authModel from "./auth.model";
import * as fileShareModel from "./file-share.model";
import * as fileModel from "./file.model";
import * as folderModel from "./folder.model";
import * as notificationModel from "./notification.model";

export * from "./auth.model";
export * from "./file-share.model";
export * from "./file.model";
export * from "./folder.model";
export * from "./notification.model";

export const relations = defineRelations({
  ...authModel,
  ...fileModel,
  ...folderModel,
  ...fileShareModel,
  ...notificationModel,
});
