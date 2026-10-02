import type { UserSummaryDTO } from "../user/dtos";

export const NotificationType = {
  File_Shared: "file_shared",
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export interface NotificationDTO {
  type: typeof NotificationType.File_Shared;
  fileId: string;
  fileName: string;
  sharedBy: UserSummaryDTO;
}
