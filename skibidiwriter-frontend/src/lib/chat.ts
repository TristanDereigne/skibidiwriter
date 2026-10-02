import { useSyncExternalStore } from "react";
import {
  ClientEventType,
  ServerEventType,
  type MessageDTO,
} from "skibidiwriter-shared";
import { realtime } from "./realtime";

const NO_MESSAGES: MessageDTO[] = [];

const messagesByDocument = new Map<string, MessageDTO[]>();
const subscribers = new Set<() => void>();

function setMessages(documentId: string, messages: MessageDTO[]) {
  messagesByDocument.set(documentId, messages);
  for (const subscriber of subscribers) subscriber();
}

realtime.onEvent((event) => {
  if (event.type === ServerEventType.Message_History) {
    setMessages(event.documentId, event.messages);
  } else if (event.type === ServerEventType.Message_New) {
    const messages = messagesByDocument.get(event.documentId) ?? NO_MESSAGES;
    setMessages(event.documentId, [...messages, event.message]);
  }
});

const subscribe = (subscriber: () => void) => {
  subscribers.add(subscriber);
  return () => {
    subscribers.delete(subscriber);
  };
};

export function useSkibidiChat(documentId: string) {
  const messages = useSyncExternalStore(
    subscribe,
    () => messagesByDocument.get(documentId) ?? NO_MESSAGES,
  );

  return {
    messages,
    sendMessage: (content: string) =>
      realtime.send({
        type: ClientEventType.Message_Create,
        documentId,
        content,
      }),
  };
}
