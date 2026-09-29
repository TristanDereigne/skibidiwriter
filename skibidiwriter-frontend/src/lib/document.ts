import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  ClientEventType,
  ServerEventType,
  TextCrdt,
  type DocumentOperation,
} from "skibidiwriter-shared";
import { realtime, useConnectionStatus } from "./realtime";

const PREFETCH_TTL = 15_000;

class DocumentSession {
  readonly #crdt = new TextCrdt(crypto.randomUUID());
  readonly #subscribers = new Set<() => void>();
  #text = "";
  #joined = false;
  #users = 0;
  #expiry: ReturnType<typeof setTimeout> | undefined;

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
    this.#joined = realtime.send({
      type: ClientEventType.Document_Join,
      documentId: this.id,
    });
    if (this.#joined) this.#sendOperations(this.#crdt.toOperations());
  }

  prefetch() {
    if (!this.#joined) this.join();
    if (this.#users > 0) return;

    clearTimeout(this.#expiry);
    this.#expiry = setTimeout(() => this.#release(), PREFETCH_TTL);
  }

  acquire() {
    clearTimeout(this.#expiry);
    this.#users++;
    sessions.set(this.id, this);
    if (!this.#joined) this.join();
  }

  release() {
    this.#users--;
    if (this.#users === 0) this.#release();
  }

  #release() {
    clearTimeout(this.#expiry);
    realtime.send({
      type: ClientEventType.Document_Leave,
      documentId: this.id,
    });
    this.#joined = false;
    if (sessions.get(this.id) === this) sessions.delete(this.id);
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

function sessionFor(id: string) {
  let session = sessions.get(id);
  if (!session) {
    session = new DocumentSession(id);
    sessions.set(id, session);
  }

  return session;
}

export function prefetchDocument(id: string) {
  sessionFor(id).prefetch();
}

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
  const session = useMemo(() => sessionFor(documentId), [documentId]);
  const text = useSyncExternalStore(session.subscribe, session.getText);

  useEffect(() => {
    session.acquire();

    return () => session.release();
  }, [session]);

  return { status, text, edit: session.edit };
}
