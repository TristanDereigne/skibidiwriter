import type { UserSummaryDTO } from "../user/dtos";

export const NotificationType = {
  File_Shared: "file_shared",
  File_Unshared: "file_unshared",
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export type NotificationDTO =
  | {
      type: typeof NotificationType.File_Shared;
      fileId: string;
      fileName: string;
      sharedBy: UserSummaryDTO;
    }
  | {
      type: typeof NotificationType.File_Unshared;
      fileId: string;
    };
