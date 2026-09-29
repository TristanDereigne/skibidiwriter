import { upgradeWebSocket } from "@hono/bun";
import type { WSContext, WSMessageReceive } from "hono/ws";
import {
  ClientEventSchema,
  ClientEventType,
  ServerEventType,
  type ClientEvent,
  type ServerEvent,
} from "skibidiwriter-shared";
import z from "zod";

const clients = new Set<WSContext>();
let content: string = "";

export const documentSocket = upgradeWebSocket(() => {
  let client: WSContext | undefined;

  return {
    onOpen(_, ws) {
      client = ws;
      clients.add(ws);
      send(ws, { type: ServerEventType.Document_Snapshot, content });
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
    case ClientEventType.Document_Edited: {
      content = event.content;

      broadcast({ type: ServerEventType.Document_Snapshot, content });
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
