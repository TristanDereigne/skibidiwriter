import { useSyncExternalStore } from "react";
import {
  ClientEventType,
  ServerEventType,
  type MessageDTO,
} from "skibidiwriter-shared";
import { realtime, useConnectionStatus } from "./realtime";

let messages: MessageDTO[] = [];
const subscribers = new Set<() => void>();

function emit() {
  for (const subscriber of subscribers) subscriber();
}

realtime.onEvent((event) => {
  if (event.type === ServerEventType.Message_History) {
    messages = event.messages;
    emit();
  } else if (event.type === ServerEventType.Message_New) {
    messages = [...messages, event.message];
    emit();
  }
});

const subscribe = (subscriber: () => void) => {
  subscribers.add(subscriber);
  return () => {
    subscribers.delete(subscriber);
  };
};

const getMessages = () => messages;

export function useSkibidiChat() {
  const status = useConnectionStatus();
  const currentMessages = useSyncExternalStore(subscribe, getMessages);

  return {
    status,
    messages: currentMessages,
    sendMessage: (content: string) =>
      realtime.send({ type: ClientEventType.Message_Create, content }),
  };
}
