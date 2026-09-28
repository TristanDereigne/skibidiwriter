import { toast } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import {
  ClientEventType,
  ServerEventType,
  type ClientEvent,
  type MessageDTO,
  type ServerEvent,
} from "skibidiwriter-shared";
import { ws } from "./socket";

type Listener = (event: ServerEvent) => void;

class SkibidiChat {
  #ws: WebSocket;
  #listeners = new Set<Listener>();

  constructor(ws: WebSocket) {
    this.#ws = ws;

    ws.addEventListener("message", (ev) => {
      const event = JSON.parse(ev.data) as ServerEvent;

      for (const listener of this.#listeners) {
        listener(event);
      }
    });
  }

  on(listener: Listener) {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);
    };
  }

  send(event: ClientEvent) {
    if (this.#ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }

    this.#ws.send(JSON.stringify(event));
  }
}

const chat = new SkibidiChat(ws);

export function useSkibidiChat() {
  const [messages, setMessages] = useState<MessageDTO[]>([]);

  useEffect(() => {
    return chat.on((event) => {
      switch (event.type) {
        case ServerEventType.Message_New:
          setMessages((prev) => [...prev, event.message]);
          break;

        case ServerEventType.Error:
          toast.add({
            title: "An error occurred",
            description: event.message,
            type: "destructive",
          });
          break;
      }
    });
  }, []);

  return {
    messages,
    sendMessage: (content: string) =>
      chat.send({ type: ClientEventType.Message_Create, content }),
  };
}
