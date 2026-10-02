import z from "zod";
import type { FileDTO } from "../file";
import type { UserSummaryDTO } from "../user";

const MAX_SHARE_RECIPIENTS = 20;

export const CreateFileSharesSchema = z.object({
  fileId: z.uuid(),
  userIds: z.array(z.string()).min(1).max(MAX_SHARE_RECIPIENTS),
});

export type CreateFileSharesDTO = z.infer<typeof CreateFileSharesSchema>;

export interface FileShareDTO {
  fileId: string;
  userId: string;
}

export interface SharedFileDTO extends FileDTO {
  owner: UserSummaryDTO;
  sharedAt: string;
}
