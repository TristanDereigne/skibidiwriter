import z from "zod";
import { NameSchema } from "../name";
import type { UserSummaryDTO } from "../user";

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
export const MAX_DOCUMENT_CONTENT_LENGTH = 200_000;

export const FILE_KINDS = ["document", "upload"] as const;
type FileKind = (typeof FILE_KINDS)[number];

export const CreateDocumentSchema = z.object({
  name: NameSchema,
  folderId: z.uuid().nullable().default(null),
  content: z.string().max(MAX_DOCUMENT_CONTENT_LENGTH).optional(),
});

export const MoveFileSchema = z.object({ folderId: z.uuid().nullable() });

export interface FileDTO {
  id: string;
  name: string;
  folderId: string | null;
  kind: FileKind;
  mimeType: string;
  sizeBytes: number;
  lastModifiedBy: UserSummaryDTO | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileDetailDTO extends FileDTO {
  isOwner: boolean;
}
