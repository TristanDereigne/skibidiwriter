import { useSyncExternalStore } from "react";
import {
  ClientEventType,
  ServerEventType,
  type MessageDTO,
} from "skibidiwriter-shared";
import { realtime } from "./realtime";

export const CHAT_TOAST_TIMEOUT = 4000;

const PREVIEW_LENGTH = 80;
const NO_MESSAGES: MessageDTO[] = [];

const messagesByDocument = new Map<string, MessageDTO[]>();
const readCountByDocument = new Map<string, number>();
const subscribers = new Set<() => void>();

function emit() {
  for (const subscriber of subscribers) subscriber();
}

function setMessages(documentId: string, messages: MessageDTO[]) {
  messagesByDocument.set(documentId, messages);
  emit();
}

realtime.onEvent((event) => {
  if (event.type === ServerEventType.Message_History) {
    readCountByDocument.set(event.documentId, event.messages.length);
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

export function messagePreview(content: string) {
  return content.length > PREVIEW_LENGTH
    ? `${content.slice(0, PREVIEW_LENGTH)}…`
    : content;
}

export function markChatRead(documentId: string) {
  readCountByDocument.set(
    documentId,
    messagesByDocument.get(documentId)?.length ?? 0,
  );
  emit();
}

export function useUnreadMessages(documentId: string) {
  return useSyncExternalStore(
    subscribe,
    () =>
      (messagesByDocument.get(documentId)?.length ?? 0) -
      (readCountByDocument.get(documentId) ?? 0),
  );
}

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
