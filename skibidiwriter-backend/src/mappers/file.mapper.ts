import type { FileRow } from "@/models";
import type { FileDetailDTO, FileDTO } from "skibidiwriter-shared";

export function toFileDTO(row: Omit<FileRow, "data" | "snapshot">): FileDTO {
  return {
    id: row.id,
    name: row.name,
    folderId: row.folderId,
    kind: row.kind,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toFileDetailDTO(
  row: Omit<FileRow, "data" | "snapshot">,
  userId: string,
): FileDetailDTO {
  const isOwner = row.ownerId === userId;

  return {
    ...toFileDTO(row),
    folderId: isOwner ? row.folderId : null,
    isOwner,
  };
}
