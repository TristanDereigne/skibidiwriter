import { useSyncExternalStore } from "react";
import {
  ClientEventType,
  ServerEventType,
  TextCrdt,
  type DocumentOperation,
} from "skibidiwriter-shared";
import { realtime, useConnectionStatus } from "./realtime";

const crdt = new TextCrdt(crypto.randomUUID());
const subscribers = new Set<() => void>();
let text = crdt.text;

function emit() {
  text = crdt.text;
  for (const subscriber of subscribers) subscriber();
}

function sendOperations(operations: DocumentOperation[]) {
  if (operations.length === 0) return;
  realtime.send({ type: ClientEventType.Document_Operations, operations });
}

realtime.onOpen(() => sendOperations(crdt.toOperations()));

realtime.onEvent((event) => {
  if (event.type === ServerEventType.Document_Operations) {
    crdt.apply(event.operations);
    emit();
  }
});

const subscribe = (subscriber: () => void) => {
  subscribers.add(subscriber);
  return () => {
    subscribers.delete(subscriber);
  };
};

const getText = () => text;

function edit(newText: string) {
  sendOperations(crdt.setText(newText));
  emit();
}

export function useSkibidiDocument() {
  const status = useConnectionStatus();
  const currentText = useSyncExternalStore(subscribe, getText);

  return { status, text: currentText, edit };
}
