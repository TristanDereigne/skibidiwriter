import { UserRow } from "@/models";
import type { UserSummaryDTO } from "skibidiwriter-shared";

export function toUserSummaryDTO(
  row: Pick<UserRow, "id" | "name">,
): UserSummaryDTO {
  return {
    id: row.id,
    name: row.name,
  };
}
