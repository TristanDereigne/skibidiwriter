import type { MessageDTO, UserSummaryDTO } from "skibidiwriter-shared";

const MESSAGE_HISTORY_LIMIT = 100;

const messagesByDocument = new Map<string, MessageDTO[]>();

function history(documentId: string) {
  return messagesByDocument.get(documentId) ?? [];
}

function create(
  documentId: string,
  author: UserSummaryDTO,
  content: string,
): MessageDTO {
  const message: MessageDTO = {
    id: crypto.randomUUID(),
    author,
    content,
    createdAt: new Date().toISOString(),
  };

  messagesByDocument.set(
    documentId,
    [...history(documentId), message].slice(-MESSAGE_HISTORY_LIMIT),
  );

  return message;
}

function clear(documentId: string) {
  messagesByDocument.delete(documentId);
}

export default {
  history,
  create,
  clear,
};
