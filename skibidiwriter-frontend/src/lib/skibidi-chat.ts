import { toast } from "@/components/ui/toast";
import { useSyncExternalStore } from "react";
import {
  ClientEventType,
  ServerEventType,
  type ClientEvent,
  type MessageDTO,
  type ServerEvent,
} from "skibidiwriter-shared";
import { api } from "./api";

export type ChatStatus = "connecting" | "connected" | "disconnected";

interface ChatState {
  status: ChatStatus;
  messages: MessageDTO[];
}

const MAX_RECONNECT_DELAY = 30_000;

class SkibidiChat {
  #ws: WebSocket | null = null;
  #state: ChatState = { status: "connecting", messages: [] };
  #subscribers = new Set<() => void>();
  #reconnectAttempts = 0;
  #reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  #closed = false;

  constructor() {
    this.#connect();
  }

  getState = () => this.#state;

  subscribe = (subscriber: () => void) => {
    this.#subscribers.add(subscriber);
    return () => {
      this.#subscribers.delete(subscriber);
    };
  };

  /** Returns false if the socket isn't connected and the event was dropped. */
  send(event: ClientEvent): boolean {
    if (this.#ws?.readyState !== WebSocket.OPEN) return false;

    this.#ws.send(JSON.stringify(event));
    return true;
  }

  close() {
    this.#closed = true;
    clearTimeout(this.#reconnectTimer);
    this.#ws?.close();
  }

  #connect() {
    const ws = api.ws.$ws();
    this.#ws = ws;
    this.#setState({ status: "connecting" });

    ws.addEventListener("open", () => {
      this.#reconnectAttempts = 0;
      this.#setState({ status: "connected" });
    });

    ws.addEventListener("message", (ev) => {
      this.#handleEvent(JSON.parse(ev.data) as ServerEvent);
    });

    ws.addEventListener("close", () => {
      if (this.#closed) return;

      this.#setState({ status: "disconnected" });
      const delay = Math.min(
        1000 * 2 ** this.#reconnectAttempts++,
        MAX_RECONNECT_DELAY,
      );
      this.#reconnectTimer = setTimeout(() => this.#connect(), delay);
    });
  }

  #handleEvent(event: ServerEvent) {
    switch (event.type) {
      case ServerEventType.Message_History:
        this.#setState({ messages: event.messages });
        break;

      case ServerEventType.Message_New:
        this.#setState({ messages: [...this.#state.messages, event.message] });
        break;

      case ServerEventType.Error:
        toast.add({
          title: "Something went wrong",
          description: event.message,
          type: "error",
        });
        break;
    }
  }

  #setState(patch: Partial<ChatState>) {
    this.#state = { ...this.#state, ...patch };
    for (const subscriber of this.#subscribers) {
      subscriber();
    }
  }
}

const chat = new SkibidiChat();

// Without this, every HMR update of this module would open another socket.
import.meta.hot?.dispose(() => chat.close());

export function useSkibidiChat() {
  const { status, messages } = useSyncExternalStore(
    chat.subscribe,
    chat.getState,
  );

  return {
    status,
    messages,
    sendMessage: (content: string) =>
      chat.send({ type: ClientEventType.Message_Create, content }),
  };
}
