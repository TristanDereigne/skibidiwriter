import { env } from "@/libs/env";
import { upgradeWebSocket } from "@hono/bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { WSContext, WSMessageReceive } from "hono/ws";
import {
  ClientEventSchema,
  ClientEventType,
  MessageDTO,
  type ServerEvent,
  ServerEventType,
} from "skibidiwriter-shared";
import { exampleController } from "./example.controller";

export const app = new Hono()
  .use("*", cors({ origin: env.FRONTEND_URL, credentials: true }))
  .get(
    "/ws",
    upgradeWebSocket((ctx) => ({
      onMessage: handleWSMessage,
    })),
  )
  .all("/", (ctx) => ctx.text("SkibidiWriter 🚽"))
  .route("/examples", exampleController);

const sockets: WSContext[] = [];
const messages: MessageDTO[] = [];

function handleWSMessage(
  rawEvent: MessageEvent<WSMessageReceive>,
  ws: WSContext,
): void {
  sockets.push(ws);

  const { data, success } = ClientEventSchema.safeParse(rawEvent);
  if (!success) {
    ws.send(
      JSON.stringify({
        type: ServerEventType.Error,
        message: "Invalid data received",
      } satisfies ServerEvent),
    );
    return;
  }

  switch (data.type) {
    case ClientEventType.Message_Create: {
      const message: MessageDTO = {
        id: crypto.randomUUID(),
        content: data.content,
      };

      messages.push(message);

      broadcast({
        type: ServerEventType.Message_New,
        message,
      });

      break;
    }
  }
}

function broadcast(event: ServerEvent) {
  for (const socket of sockets) {
    socket.send(JSON.stringify(event));
  }
}
