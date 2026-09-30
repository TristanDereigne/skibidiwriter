import z from "zod";
import { NameSchema } from "../name";

export const MAX_DOCUMENT_CONTENT_LENGTH = 200_000;

export const CreateDocumentSchema = z.object({
  name: NameSchema,
  folderId: z.uuid().nullable().default(null),
  content: z.string().max(MAX_DOCUMENT_CONTENT_LENGTH).optional(),
});
export type CreateDocumentDTO = z.infer<typeof CreateDocumentSchema>;
