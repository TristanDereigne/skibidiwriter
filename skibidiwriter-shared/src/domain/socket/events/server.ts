import type { DocumentOperation } from "../../document/operations";
import type { MessageDTO } from "../../messages/dtos";

export const ServerEventType = {
  Message_History: "message_history",
  Message_New: "message_new",
  Document_Operations: "document_operations",
  Error: "error",
} as const;
export type ServerEventType =
  (typeof ServerEventType)[keyof typeof ServerEventType];

export type ServerEvent =
  | {
      type: typeof ServerEventType.Message_History;
      messages: MessageDTO[];
    }
  | {
      type: typeof ServerEventType.Message_New;
      message: MessageDTO;
    }
  | {
      type: typeof ServerEventType.Document_Operations;
      documentId: string;
      operations: DocumentOperation[];
    }
  | {
      type: typeof ServerEventType.Error;
      message: string;
    };
