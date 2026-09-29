import z from "zod";
import { NameSchema } from "../name";

export const CreateDocumentSchema = z.object({
  name: NameSchema,
  folderId: z.uuid().nullable().default(null),
});
export type CreateDocumentDTO = z.infer<typeof CreateDocumentSchema>;

export interface DocumentDTO {
  id: string;
  name: string;
  folderId: string | null;
  updatedAt: string;
}
