import type { MessageDTO } from "../messages/dtos";
import type { UserSummaryDTO } from "../user/dtos";

export const NotificationType = {
  File_Shared: "file_shared",
  File_Unshared: "file_unshared",
  Message_Received: "message_received",
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
    }
  | {
      type: typeof NotificationType.Message_Received;
      fileId: string;
      fileName: string;
      message: MessageDTO;
    };
