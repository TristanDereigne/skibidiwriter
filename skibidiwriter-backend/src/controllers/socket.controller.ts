import { addConnection, broadcast, removeConnection, send } from "@/libs/socket";
import chatService from "@/services/chat.service";
import documentService from "@/services/document.service";
import { upgradeWebSocket } from "@hono/bun";
import type { WSContext, WSMessageReceive } from "hono/ws";
import {
  ClientEventSchema,
  ClientEventType,
  ServerEventType,
  type ClientEvent,
} from "skibidiwriter-shared";
import z from "zod";

export const socketController = upgradeWebSocket(() => {
  let connection: WSContext | undefined;

  return {
    onOpen(_, ws) {
      connection = ws;
      addConnection(ws);
      send(ws, {
        type: ServerEventType.Message_History,
        messages: chatService.history(),
      });
      send(ws, {
        type: ServerEventType.Document_Operations,
        operations: documentService.operations(),
      });
    },
    onMessage(rawEvent, ws) {
      const result = parseClientEvent(rawEvent.data);
      if (!result.success) {
        send(ws, { type: ServerEventType.Error, message: result.error });
        return;
      }

      handleClientEvent(result.data, ws);
    },
    onClose() {
      if (connection) removeConnection(connection);
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

function handleClientEvent(event: ClientEvent, sender: WSContext) {
  switch (event.type) {
    case ClientEventType.Message_Create: {
      const message = chatService.create(event.content);
      broadcast({ type: ServerEventType.Message_New, message });
      break;
    }
    case ClientEventType.Document_Operations: {
      const operations = documentService.apply(event.operations);
      if (operations.length > 0) {
        broadcast({ type: ServerEventType.Document_Operations, operations }, sender);
      }
      break;
    }
  }
}
