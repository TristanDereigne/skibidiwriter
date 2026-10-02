import type { FileShareRow, UserRow } from "@/models";
import type { FileShareDTO, SharedFileDTO } from "skibidiwriter-shared";
import { toFileDTO, type FileSummaryRow } from "./file.mapper";
import { toUserSummaryDTO } from "./user.mapper";

export function toFileShareDTO(row: FileShareRow): FileShareDTO {
  return {
    userId: row.userId,
    fileId: row.fileId,
  };
}

interface SharedFileRow {
  file: FileSummaryRow;
  owner: Pick<UserRow, "id" | "name">;
  sharedAt: Date;
}

export function toSharedFileDTO(row: SharedFileRow): SharedFileDTO {
  return {
    ...toFileDTO(row.file),
    owner: toUserSummaryDTO(row.owner),
    sharedAt: row.sharedAt.toISOString(),
  };
}
