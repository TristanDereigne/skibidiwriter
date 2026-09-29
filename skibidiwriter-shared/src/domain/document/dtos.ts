import z from "zod";

const DocumentNameSchema = z.string().trim().min(1).max(255);

export const CreateDocumentSchema = z.object({ name: DocumentNameSchema });
export type CreateDocumentDTO = z.infer<typeof CreateDocumentSchema>;

export const RenameDocumentSchema = z.object({ name: DocumentNameSchema });
export type RenameDocumentDTO = z.infer<typeof RenameDocumentSchema>;

export interface DocumentDTO {
  id: string;
  name: string;
  updatedAt: string;
}
