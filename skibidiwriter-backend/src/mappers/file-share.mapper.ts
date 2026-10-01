import type { FileRow, FileShareRow, UserRow } from "@/models";
import type { FileShareDTO, SharedFileDTO } from "skibidiwriter-shared";
import { toFileDTO } from "./file.mapper";
import { toUserSummaryDTO } from "./user.mapper";

export function toFileShareDTO(row: FileShareRow): FileShareDTO {
  return {
    userId: row.userId,
    fileId: row.fileId,
  };
}

interface SharedFileRow {
  file: Omit<FileRow, "data" | "operations">;
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
