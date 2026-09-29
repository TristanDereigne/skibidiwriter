import {
  addConnection,
  broadcast,
  broadcastToRoom,
  joinRoom,
  leaveRoom,
  removeConnection,
  roomsOf,
  send,
} from "@/libs/socket";
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
    },
    async onMessage(rawEvent, ws) {
      const result = parseClientEvent(rawEvent.data);
      if (!result.success) {
        send(ws, { type: ServerEventType.Error, message: result.error });
        return;
      }

      await handleClientEvent(result.data, ws);
    },
    onClose() {
      if (!connection) return;

      for (const documentId of roomsOf(connection)) {
        leaveDocument(connection, documentId);
      }
      removeConnection(connection);
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

async function handleClientEvent(event: ClientEvent, sender: WSContext) {
  switch (event.type) {
    case ClientEventType.Message_Create: {
      const message = chatService.create(event.content);

      broadcast({ type: ServerEventType.Message_New, message });
      break;
    }
    case ClientEventType.Document_Join: {
      const operations = await documentService.operations(event.documentId);
      if (!operations) return sendDocumentNotFound(sender);

      joinRoom(sender, event.documentId);
      send(sender, {
        type: ServerEventType.Document_Operations,
        documentId: event.documentId,
        operations,
      });
      break;
    }
    case ClientEventType.Document_Leave: {
      leaveDocument(sender, event.documentId);
      break;
    }
    case ClientEventType.Document_Operations: {
      const operations = await documentService.apply(
        event.documentId,
        event.operations,
      );
      if (!operations) return sendDocumentNotFound(sender);

      if (operations.length > 0) {
        broadcastToRoom(
          event.documentId,
          {
            type: ServerEventType.Document_Operations,
            documentId: event.documentId,
            operations,
          },
          sender,
        );
      }
      break;
    }
  }
}

function leaveDocument(connection: WSContext, documentId: string) {
  if (leaveRoom(connection, documentId)) {
    void documentService.release(documentId);
  }
}

function sendDocumentNotFound(ws: WSContext) {
  send(ws, { type: ServerEventType.Error, message: "Document not found" });
}
