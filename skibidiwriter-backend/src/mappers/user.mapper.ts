import { UserRow } from "@/models";
import type { UserSummaryDTO } from "skibidiwriter-shared";

export function toUserSummaryDTO(row: UserRow): UserSummaryDTO {
  return {
    id: row.id,
    name: row.name,
  };
}
