import { toast } from "@/components/ui/toast";
import { useSyncExternalStore } from "react";
import {
  ServerEventType,
  type ClientEvent,
  type ServerEvent,
} from "skibidiwriter-shared";
import { api } from "./api";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export const CONNECTION_STATUS_LABELS: Record<ConnectionStatus, string> = {
  connecting: "Connecting…",
  connected: "Connected",
  disconnected: "Reconnecting…",
};

const MAX_RECONNECT_DELAY = 30_000;

class RealtimeClient {
  #ws: WebSocket | null = null;
  #status: ConnectionStatus = "connecting";
  #statusSubscribers = new Set<() => void>();
  #eventListeners = new Set<(event: ServerEvent) => void>();
  #openListeners = new Set<() => void>();
  #reconnectAttempts = 0;
  #reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  #closed = false;

  constructor() {
    this.#connect();
  }

  getStatus = () => this.#status;

  subscribeStatus = (subscriber: () => void) => {
    this.#statusSubscribers.add(subscriber);
    return () => {
      this.#statusSubscribers.delete(subscriber);
    };
  };

  onEvent(listener: (event: ServerEvent) => void) {
    this.#eventListeners.add(listener);
    return () => {
      this.#eventListeners.delete(listener);
    };
  }

  onOpen(listener: () => void) {
    this.#openListeners.add(listener);
    return () => {
      this.#openListeners.delete(listener);
    };
  }

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
    this.#setStatus("connecting");

    ws.addEventListener("open", () => {
      this.#reconnectAttempts = 0;
      this.#setStatus("connected");
      for (const listener of this.#openListeners) listener();
    });

    ws.addEventListener("message", (ev) => {
      const event = JSON.parse(ev.data) as ServerEvent;

      if (event.type === ServerEventType.Error) {
        toast.add({
          title: "Something went wrong",
          description: event.message,
          type: "error",
        });
      }

      for (const listener of this.#eventListeners) listener(event);
    });

    ws.addEventListener("close", () => {
      if (this.#closed) return;

      this.#setStatus("disconnected");
      const delay = Math.min(
        1000 * 2 ** this.#reconnectAttempts++,
        MAX_RECONNECT_DELAY,
      );
      this.#reconnectTimer = setTimeout(() => this.#connect(), delay);
    });
  }

  #setStatus(status: ConnectionStatus) {
    this.#status = status;
    for (const subscriber of this.#statusSubscribers) subscriber();
  }
}

export const realtime = new RealtimeClient();

import.meta.hot?.dispose(() => realtime.close());

export function useConnectionStatus() {
  return useSyncExternalStore(realtime.subscribeStatus, realtime.getStatus);
}
