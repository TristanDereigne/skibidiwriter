import z from "zod";
import { DocumentOperationSchema } from "../../document/operations";
import { MESSAGE_MAX_LENGTH } from "../../messages/constants";

export const ClientEventType = {
  Message_Create: "message_create",
  Document_Operations: "document_operations",
} as const;
export type ClientEventType =
  (typeof ClientEventType)[keyof typeof ClientEventType];

export const ClientEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ClientEventType.Message_Create),
    content: z.string().trim().min(1).max(MESSAGE_MAX_LENGTH),
  }),
  z.object({
    type: z.literal(ClientEventType.Document_Operations),
    operations: z.array(DocumentOperationSchema),
  }),
]);
export type ClientEvent = z.infer<typeof ClientEventSchema>;
