import z from "zod";

export const CreateDocumentSchema = z.object({
  name: z.string().trim().min(1).max(255),
});
export type CreateDocumentDTO = z.infer<typeof CreateDocumentSchema>;

export interface DocumentDTO {
  id: string;
  name: string;
  updatedAt: string;
}
