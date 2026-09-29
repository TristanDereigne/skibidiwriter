import type { WSContext } from "hono/ws";
import type { ServerEvent } from "skibidiwriter-shared";

// Hono hands out a new WSContext per event, so connections are keyed by the underlying socket.
const connections = new Map<unknown, WSContext>();
const rooms = new Map<string, Map<unknown, WSContext>>();

const keyOf = (ws: WSContext) => ws.raw ?? ws;

export function addConnection(ws: WSContext) {
  connections.set(keyOf(ws), ws);
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

export function send(ws: WSContext, event: ServerEvent) {
  ws.send(JSON.stringify(event));
}

export function broadcast(event: ServerEvent, except?: WSContext) {
  const payload = JSON.stringify(event);
  for (const [key, connection] of connections) {
    if (key !== (except && keyOf(except))) connection.send(payload);
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
