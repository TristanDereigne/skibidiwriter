import z from "zod";
import { MESSAGE_MAX_LENGTH } from "../../messages/constants";

export const ClientEventType = {
  Message_Create: "message_create",
} as const;
export type ClientEventType =
  (typeof ClientEventType)[keyof typeof ClientEventType];

export const ClientEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ClientEventType.Message_Create),
    content: z.string().trim().min(1).max(MESSAGE_MAX_LENGTH),
  }),
]);
export type ClientEvent = z.infer<typeof ClientEventSchema>;
