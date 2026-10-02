import {
  addConnection,
  broadcastToRoom,
  connectionsOf,
  joinRoom,
  leaveRoom,
  markAbsent,
  markPresent,
  presentUsers,
  removeConnection,
  roomsOf,
  send,
} from "@/libs/socket";
import chatService from "@/services/chat.service";
import fileService from "@/services/file.service";
import type { AuthEnv } from "@/middleware/session.middleware";
import { upgradeWebSocket } from "@hono/bun";
import type { Context } from "hono";
import type { WSContext, WSMessageReceive } from "hono/ws";
import {
  ClientEventSchema,
  ClientEventType,
  ErrorCode,
  ServerEventType,
  type ClientEvent,
  type UserSummaryDTO,
} from "skibidiwriter-shared";

export const socketController = upgradeWebSocket((ctx: Context<AuthEnv>) => {
  const user: UserSummaryDTO = {
    id: ctx.get("userId"),
    name: ctx.get("user").name,
  };
  let connection: WSContext | undefined;
  let queue: Promise<void> = Promise.resolve();

  return {
    onOpen(_, ws) {
      connection = ws;
      addConnection(ws, user.id);
    },
    async onMessage(rawEvent, ws) {
      const result = parseClientEvent(rawEvent.data);
      if (!result.success) {
        send(ws, { type: ServerEventType.Error, code: result.error });
        return;
      }

      queue = queue
        .then(() => handleClientEvent(result.data, ws, user))
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
): { success: true; data: ClientEvent } | { success: false; error: ErrorCode } {
  if (typeof data !== "string") {
    return { success: false, error: ErrorCode.Socket_TextExpected };
  }

  let json: unknown;
  try {
    json = JSON.parse(data);
  } catch {
    return { success: false, error: ErrorCode.Socket_MalformedJson };
  }

  const result = ClientEventSchema.safeParse(json);
  if (!result.success) {
    return { success: false, error: ErrorCode.Socket_InvalidEvent };
  }

  return { success: true, data: result.data };
}

async function handleClientEvent(
  event: ClientEvent,
  sender: WSContext,
  user: UserSummaryDTO,
) {
  switch (event.type) {
    case ClientEventType.Message_Create: {
      if (!roomsOf(sender).includes(event.documentId)) {
        return sendDocumentNotFound(sender);
      }

      const message = chatService.create(event.documentId, user, event.content);

      broadcastToRoom(event.documentId, {
        type: ServerEventType.Message_New,
        documentId: event.documentId,
        message,
      });
      break;
    }
    case ClientEventType.Document_Join: {
      const canAccess = await fileService.hasAccess(event.documentId, user.id);
      if (!canAccess) return sendDocumentNotFound(sender);

      const operations = await fileService.operations(event.documentId);
      if (!operations) return sendDocumentNotFound(sender);

      joinRoom(sender, event.documentId);
      send(sender, {
        type: ServerEventType.Document_Operations,
        documentId: event.documentId,
        operations,
      });
      send(sender, {
        type: ServerEventType.Message_History,
        documentId: event.documentId,
        messages: chatService.history(event.documentId),
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

      const operations = await fileService.apply(
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
    case ClientEventType.Document_Present: {
      if (!roomsOf(sender).includes(event.documentId)) return;

      if (markPresent(event.documentId, sender, user)) {
        broadcastParticipants(event.documentId);
      }
      break;
    }
  }
}

function leaveDocument(connection: WSContext, documentId: string) {
  const wasPresent = markAbsent(documentId, connection);
  const isEmpty = leaveRoom(connection, documentId);

  if (wasPresent) broadcastParticipants(documentId);
  if (isEmpty) void fileService.release(documentId);
}

export function evictUser(documentId: string, userId: string) {
  for (const connection of connectionsOf(documentId, userId)) {
    leaveDocument(connection, documentId);
    send(connection, { type: ServerEventType.Document_Revoked, documentId });
  }
}

function broadcastParticipants(documentId: string) {
  broadcastToRoom(documentId, {
    type: ServerEventType.Document_Participants,
    documentId,
    participants: presentUsers(documentId),
  });
}

function sendDocumentNotFound(ws: WSContext) {
  send(ws, { type: ServerEventType.Error, code: ErrorCode.Document_NotFound });
}
