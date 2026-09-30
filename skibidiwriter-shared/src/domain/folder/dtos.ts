import z from "zod";
import { NameSchema } from "../name";

export const CreateFolderSchema = z.object({
  name: NameSchema,
  parentId: z.uuid().nullable().default(null),
});
export type CreateFolderDTO = z.infer<typeof CreateFolderSchema>;

export const MoveFolderSchema = z.object({ parentId: z.uuid().nullable() });
export type MoveFolderDTO = z.infer<typeof MoveFolderSchema>;

export interface FolderDTO {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}
