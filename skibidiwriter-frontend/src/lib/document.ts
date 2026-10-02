import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  ClientEventType,
  ServerEventType,
  TextCrdt,
  type DocumentOperation,
  type UserSummaryDTO,
} from "skibidiwriter-shared";
import { realtime, useConnectionStatus } from "./realtime";

const PREFETCH_TTL = 15_000;
const NO_PARTICIPANTS: UserSummaryDTO[] = [];

class DocumentSession {
  readonly #crdt = new TextCrdt(crypto.randomUUID());
  readonly #subscribers = new Set<() => void>();
  #text = "";
  #joined = false;
  #users = 0;
  #expiry: ReturnType<typeof setTimeout> | undefined;
  #participants = NO_PARTICIPANTS;

  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  getText = () => this.#text;

  getParticipants = () => this.#participants;

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
    if (!this.#joined) return;

    this.#sendOperations(this.#crdt.toOperations());
    this.#sendPresence();
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

    if (this.#joined) this.#sendPresence();
    else this.join();
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
    this.setParticipants(NO_PARTICIPANTS);
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

  setParticipants(participants: UserSummaryDTO[]) {
    if (participants === this.#participants) return;

    this.#participants = participants;
    this.#notify();
  }

  #sendPresence() {
    if (!this.#joined || this.#users === 0) return;

    realtime.send({
      type: ClientEventType.Document_Present,
      documentId: this.id,
    });
  }

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
    this.#notify();
  }

  #notify() {
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
  switch (event.type) {
    case ServerEventType.Document_Operations:
      sessions.get(event.documentId)?.apply(event.operations);
      break;
    case ServerEventType.Document_Participants:
      sessions.get(event.documentId)?.setParticipants(event.participants);
      break;
  }
});

export function useDocumentParticipants(documentId: string) {
  const status = useConnectionStatus();
  const session = useMemo(() => sessionFor(documentId), [documentId]);
  const participants = useSyncExternalStore(
    session.subscribe,
    session.getParticipants,
  );

  return status === "connected" ? participants : NO_PARTICIPANTS;
}

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
