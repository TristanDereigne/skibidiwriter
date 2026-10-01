import z from "zod";

export const MAX_SHARE_RECIPIENTS = 20;

export const CreateFileSharesSchema = z.object({
  fileId: z.uuid(),
  userIds: z.array(z.string()).min(1).max(MAX_SHARE_RECIPIENTS),
});

export type CreateFileSharesInput = z.infer<typeof CreateFileSharesSchema>;

export interface FileShareDTO {
  fileId: string;
  userId: string;
}
