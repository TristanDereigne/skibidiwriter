import type { WSContext } from "hono/ws";
import type { ServerEvent, UserSummaryDTO } from "skibidiwriter-shared";

// Hono hands out a new WSContext per event, so connections are keyed by the underlying socket.
const connections = new Map<unknown, { ws: WSContext; userId: string }>();
const rooms = new Map<string, Map<unknown, WSContext>>();
const presence = new Map<string, Map<unknown, UserSummaryDTO>>();

const keyOf = (ws: WSContext) => ws.raw ?? ws;

export function addConnection(ws: WSContext, userId: string) {
  connections.set(keyOf(ws), { ws, userId });
}

export function removeConnection(ws: WSContext) {
  connections.delete(keyOf(ws));
}

export function joinRoom(ws: WSContext, roomId: string) {
  let room = rooms.get(roomId);
  if (!room) {
    room = new Map();
    rooms.set(roomId, room);
  }

  room.set(keyOf(ws), ws);
}

export function leaveRoom(ws: WSContext, roomId: string): boolean {
  const room = rooms.get(roomId);
  if (!room) return true;

  room.delete(keyOf(ws));
  if (room.size > 0) return false;

  rooms.delete(roomId);
  return true;
}

export function roomsOf(ws: WSContext): string[] {
  const key = keyOf(ws);

  return [...rooms].filter(([, room]) => room.has(key)).map(([id]) => id);
}

export function connectionsOf(roomId: string, userId: string): WSContext[] {
  return [...(rooms.get(roomId) ?? [])]
    .filter(([key]) => connections.get(key)?.userId === userId)
    .map(([, ws]) => ws);
}

export function markPresent(
  roomId: string,
  ws: WSContext,
  user: UserSummaryDTO,
): boolean {
  let room = presence.get(roomId);
  if (!room) {
    room = new Map();
    presence.set(roomId, room);
  }

  if (room.has(keyOf(ws))) return false;

  room.set(keyOf(ws), user);
  return true;
}

export function markAbsent(roomId: string, ws: WSContext): boolean {
  const room = presence.get(roomId);
  if (!room?.delete(keyOf(ws))) return false;

  if (room.size === 0) presence.delete(roomId);
  return true;
}

export function presentUsers(roomId: string): UserSummaryDTO[] {
  const users = presence.get(roomId)?.values() ?? [];

  return [...new Map([...users].map((user) => [user.id, user])).values()];
}

export function send(ws: WSContext, event: ServerEvent) {
  ws.send(JSON.stringify(event));
}

export function sendToUser(userId: string, event: ServerEvent) {
  for (const connection of connections.values()) {
    if (connection.userId === userId) send(connection.ws, event);
  }
}

export function broadcastToRoom(
  roomId: string,
  event: ServerEvent,
  except?: WSContext,
) {
  const payload = JSON.stringify(event);
  for (const [key, connection] of rooms.get(roomId) ?? []) {
    if (key !== (except && keyOf(except))) connection.send(payload);
  }
}
