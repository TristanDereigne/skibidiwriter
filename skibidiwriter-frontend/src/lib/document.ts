import { useSyncExternalStore } from "react";
import { ClientEventType, ServerEventType } from "skibidiwriter-shared";
import { realtime, useConnectionStatus } from "./realtime";

let content: string = "";
const subscribers = new Set<() => void>();

function emit() {
  for (const subscriber of subscribers) subscriber();
}

realtime.onEvent((event) => {
  if (event.type === ServerEventType.Document_Snapshot) {
    content = event.content;
    emit();
  }
});

const subscribe = (subscriber: () => void) => {
  subscribers.add(subscriber);
  return () => {
    subscribers.delete(subscriber);
  };
};

export function useSkibidiDocument() {
  const status = useConnectionStatus();
  const currentContent = useSyncExternalStore(subscribe, () => content);

  return {
    status,
    content: currentContent,
    sendContent: (content: string) =>
      realtime.send({ type: ClientEventType.Document_Edited, content }),
  };
}
