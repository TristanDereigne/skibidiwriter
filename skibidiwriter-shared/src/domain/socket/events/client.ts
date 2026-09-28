import z from "zod";
import { MESSAGE_MAX_LENGTH } from "../../messages/constants";

export enum ClientEventType {
  Message_Create = "message_create",
}

export const ClientEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ClientEventType.Message_Create),
    content: z.string().trim().max(MESSAGE_MAX_LENGTH),
  }),
]);
export type ClientEvent = z.infer<typeof ClientEventSchema>;
