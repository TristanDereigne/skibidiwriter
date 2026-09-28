import type { MessageDTO } from "../../messages/dtos";

export enum ServerEventType {
  Message_New = "message_new",
  Error = "error",
}

export type ServerEvent =
  | {
      type: ServerEventType.Message_New;
      message: MessageDTO;
    }
  | {
      type: ServerEventType.Error;
      message: string;
    };
