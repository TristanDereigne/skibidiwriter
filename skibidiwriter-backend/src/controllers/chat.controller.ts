import { upgradeWebSocket } from "@hono/bun";
import type { WSContext, WSMessageReceive } from "hono/ws";
import {
  ClientEventSchema,
  ClientEventType,
  ServerEventType,
  type ClientEvent,
  type MessageDTO,
  type ServerEvent,
} from "skibidiwriter-shared";
import z from "zod";

const MESSAGE_HISTORY_LIMIT = 100;

const clients = new Set<WSContext>();
const messages: MessageDTO[] = [];

export const chatSocket = upgradeWebSocket(() => {
  // Hono creates a new WSContext for every event, so the one from onOpen is
  // kept to identify this connection in `clients`.
  let client: WSContext | undefined;

  return {
    onOpen(_, ws) {
      client = ws;
      clients.add(ws);
      send(ws, { type: ServerEventType.Message_History, messages });
    },
    onMessage(rawEvent, ws) {
      const result = parseClientEvent(rawEvent.data);
      if (!result.success) {
        send(ws, { type: ServerEventType.Error, message: result.error });
        return;
      }

      handleClientEvent(result.data);
    },
    onClose() {
      if (client) clients.delete(client);
    },
  };
});

function parseClientEvent(
  data: WSMessageReceive,
): { success: true; data: ClientEvent } | { success: false; error: string } {
  if (typeof data !== "string") {
    return { success: false, error: "Expected a text message" };
  }

  let json: unknown;
  try {
    json = JSON.parse(data);
  } catch {
    return { success: false, error: "Malformed JSON" };
  }

  const result = ClientEventSchema.safeParse(json);
  if (!result.success) {
    return { success: false, error: z.prettifyError(result.error) };
  }

  return { success: true, data: result.data };
}

function handleClientEvent(event: ClientEvent) {
  switch (event.type) {
    case ClientEventType.Message_Create: {
      const message: MessageDTO = {
        id: crypto.randomUUID(),
        content: event.content,
        createdAt: new Date().toISOString(),
      };

      messages.push(message);
      if (messages.length > MESSAGE_HISTORY_LIMIT) {
        messages.splice(0, messages.length - MESSAGE_HISTORY_LIMIT);
      }

      broadcast({ type: ServerEventType.Message_New, message });
      break;
    }
  }
}

function send(ws: WSContext, event: ServerEvent) {
  ws.send(JSON.stringify(event));
}

function broadcast(event: ServerEvent) {
  const payload = JSON.stringify(event);
  for (const client of clients) {
    client.send(payload);
  }
}
