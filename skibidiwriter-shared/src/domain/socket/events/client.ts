import { MESSAGE_MAX_LENGTH } from "@/domain/messages/constants";
import z from "zod";

export enum ClientEventType {
  Message_Create = "message_create",
}

export const clientEvent = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ClientEventType.Message_Create),
    content: z.string().trim().max(MESSAGE_MAX_LENGTH),
  }),
]);
export type ClientEvent = z.infer<typeof clientEvent>;
