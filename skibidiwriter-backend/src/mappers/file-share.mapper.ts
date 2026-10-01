import type { FileShareRow } from "@/models";
import type { FileShareDTO } from "skibidiwriter-shared";

export function toFileShareDTO(row: FileShareRow): FileShareDTO {
  return {
    userId: row.userId,
    fileId: row.fileId,
  };
}
