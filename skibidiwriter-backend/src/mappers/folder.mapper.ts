import type { FolderRow } from "@/models";
import type { FolderDTO } from "skibidiwriter-shared";

export function toFolderDTO(
  row: Pick<FolderRow, "id" | "name" | "parentId" | "createdAt" | "updatedAt">,
): FolderDTO {
  return {
    id: row.id,
    name: row.name,
    parentId: row.parentId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
