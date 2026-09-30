import type { FileRow } from "@/models";
import type { FileDTO } from "skibidiwriter-shared";

export function toFileDTO(row: Omit<FileRow, "data" | "operations">): FileDTO {
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
