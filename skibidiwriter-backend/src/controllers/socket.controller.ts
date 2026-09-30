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
import type { AuthEnv } from "@/libs/require-auth";
import { upgradeWebSocket } from "@hono/bun";
import type { Context } from "hono";
import type { WSContext, WSMessageReceive } from "hono/ws";
import {
  ClientEventSchema,
  ClientEventType,
  ServerEventType,
  type ClientEvent,
} from "skibidiwriter-shared";
import z from "zod";

export const socketController = upgradeWebSocket((ctx: Context<AuthEnv>) => {
  const userId = ctx.get("userId");
  let connection: WSContext | undefined;
  let queue: Promise<void> = Promise.resolve();

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

      queue = queue
        .then(() => handleClientEvent(result.data, ws, userId))
        .catch((error) => console.error("Socket event failed", error));

      await queue;
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

async function handleClientEvent(
  event: ClientEvent,
  sender: WSContext,
  userId: string,
) {
  switch (event.type) {
    case ClientEventType.Message_Create: {
      const message = chatService.create(event.content);

      broadcast({ type: ServerEventType.Message_New, message });
      break;
    }
    case ClientEventType.Document_Join: {
      const canAccess = await documentService.hasAccess(
        event.documentId,
        userId,
      );
      if (!canAccess) return sendDocumentNotFound(sender);

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
      if (roomsOf(sender).includes(event.documentId)) {
        leaveDocument(sender, event.documentId);
      }
      break;
    }
    case ClientEventType.Document_Operations: {
      if (!roomsOf(sender).includes(event.documentId)) {
        return sendDocumentNotFound(sender);
      }

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
