import z from "zod";
import { NameSchema } from "../name";

export const CreateFolderSchema = z.object({
  name: NameSchema,
  parentId: z.uuid().nullable().default(null),
});

export const MoveFolderSchema = z.object({ parentId: z.uuid().nullable() });

export interface FolderDTO {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}
