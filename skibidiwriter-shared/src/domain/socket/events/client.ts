import z from "zod";
import { MESSAGE_MAX_LENGTH } from "../../messages/constants";

export const ClientEventType = {
  Message_Create: "message_create",
  Document_Edited: "document_edited",
  Doc_Join: "doc_join",
  Doc_Operation: "doc_operation",
  Doc_Leave: "doc_leave",
} as const;
export type ClientEventType =
  (typeof ClientEventType)[keyof typeof ClientEventType];

export const ClientEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ClientEventType.Message_Create),
    content: z.string().trim().min(1).max(MESSAGE_MAX_LENGTH),
  }),
  z.object({
    type: z.literal(ClientEventType.Doc_Join),
    docId: z.string(),
  }),
  z.object({
    type: z.literal(ClientEventType.Doc_Operation),
    docId: z.string(),
    operation: z.unknown(),
  }),
  z.object({
    type: z.literal(ClientEventType.Doc_Leave),
    docId: z.string(),
  }),
]);
export type ClientEvent = z.infer<typeof ClientEventSchema>;
