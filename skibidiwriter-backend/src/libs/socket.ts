import type { WSContext } from "hono/ws";
import type { ServerEvent } from "skibidiwriter-shared";

const connections = new Set<WSContext>();

export function addConnection(ws: WSContext) {
  connections.add(ws);
}

export function removeConnection(ws: WSContext) {
  connections.delete(ws);
}

export function send(ws: WSContext, event: ServerEvent) {
  ws.send(JSON.stringify(event));
}

export function broadcast(event: ServerEvent, except?: WSContext) {
  const payload = JSON.stringify(event);
  for (const connection of connections) {
    if (connection !== except) connection.send(payload);
  }
}
