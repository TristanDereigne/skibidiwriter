import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  ClientEventType,
  ServerEventType,
  TextCrdt,
  type DocumentOperation,
} from "skibidiwriter-shared";
import { realtime, useConnectionStatus } from "./realtime";

class DocumentSession {
  readonly #crdt = new TextCrdt(crypto.randomUUID());
  readonly #subscribers = new Set<() => void>();
  #text = "";

  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  getText = () => this.#text;

  subscribe = (subscriber: () => void) => {
    this.#subscribers.add(subscriber);
    return () => {
      this.#subscribers.delete(subscriber);
    };
  };

  join() {
    realtime.send({ type: ClientEventType.Document_Join, documentId: this.id });
    this.#sendOperations(this.#crdt.toOperations());
  }

  leave() {
    realtime.send({
      type: ClientEventType.Document_Leave,
      documentId: this.id,
    });
  }

  apply(operations: DocumentOperation[]) {
    this.#crdt.apply(operations);
    this.#emit();
  }

  edit = (text: string) => {
    this.#sendOperations(this.#crdt.setText(text));
    this.#emit();
  };

  #sendOperations(operations: DocumentOperation[]) {
    if (operations.length === 0) return;

    realtime.send({
      type: ClientEventType.Document_Operations,
      documentId: this.id,
      operations,
    });
  }

  #emit() {
    this.#text = this.#crdt.text;
    for (const subscriber of this.#subscribers) subscriber();
  }
}

const sessions = new Map<string, DocumentSession>();

realtime.onOpen(() => {
  for (const session of sessions.values()) session.join();
});

realtime.onEvent((event) => {
  if (event.type === ServerEventType.Document_Operations) {
    sessions.get(event.documentId)?.apply(event.operations);
  }
});

export function useSkibidiDocument(documentId: string) {
  const status = useConnectionStatus();
  const session = useMemo(() => new DocumentSession(documentId), [documentId]);
  const text = useSyncExternalStore(session.subscribe, session.getText);

  useEffect(() => {
    sessions.set(documentId, session);
    session.join();

    return () => {
      session.leave();
      sessions.delete(documentId);
    };
  }, [documentId, session]);

  return { status, text, edit: session.edit };
}
