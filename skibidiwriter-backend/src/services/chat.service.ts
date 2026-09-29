import type { MessageDTO } from "skibidiwriter-shared";

const MESSAGE_HISTORY_LIMIT = 100;

const messages: MessageDTO[] = [];

function history() {
  return messages;
}

function create(content: string): MessageDTO {
  const message: MessageDTO = {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  if (messages.length > MESSAGE_HISTORY_LIMIT) {
    messages.splice(0, messages.length - MESSAGE_HISTORY_LIMIT);
  }

  return message;
}

export default {
  history,
  create,
};
