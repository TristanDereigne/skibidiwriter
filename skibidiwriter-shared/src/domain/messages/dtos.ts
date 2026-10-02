import type { UserSummaryDTO } from "../user/dtos";

export interface MessageDTO {
  id: string;
  author: UserSummaryDTO;
  content: string;
  createdAt: string;
}
