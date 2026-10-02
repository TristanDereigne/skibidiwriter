import type { FileRow, UserRow } from "@/models";
import type { FileDetailDTO, FileDTO } from "skibidiwriter-shared";
import { toUserSummaryDTO } from "./user.mapper";

export type FileSummaryRow = Omit<
  FileRow,
  "data" | "snapshot" | "lastModifiedById"
> & {
  lastModifiedBy: Pick<UserRow, "id" | "name"> | null;
};

export function toFileDTO(row: FileSummaryRow): FileDTO {
  return {
    id: row.id,
    name: row.name,
    folderId: row.folderId,
    kind: row.kind,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    lastModifiedBy: row.lastModifiedBy
      ? toUserSummaryDTO(row.lastModifiedBy)
      : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toFileDetailDTO(
  row: FileSummaryRow,
  userId: string,
): FileDetailDTO {
  const isOwner = row.ownerId === userId;

  return {
    ...toFileDTO(row),
    folderId: isOwner ? row.folderId : null,
    isOwner,
  };
}
