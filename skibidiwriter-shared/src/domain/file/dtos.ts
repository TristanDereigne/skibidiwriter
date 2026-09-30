import z from "zod";

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

export const MoveFileSchema = z.object({ folderId: z.uuid().nullable() });
export type MoveFileDTO = z.infer<typeof MoveFileSchema>;

export interface FileDTO {
  id: string;
  name: string;
  folderId: string | null;
  mimeType: string;
  size: number;
  updatedAt: string;
}
