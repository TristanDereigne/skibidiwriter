import { env } from "@/libs/env";
import { upgradeWebSocket } from "@hono/bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { WSContext, WSMessageReceive } from "hono/ws";
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

function handleWSMessage(
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext,
): void {}
