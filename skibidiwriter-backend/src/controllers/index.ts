import { env } from "@/libs/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { documentController } from "./document.controller";
import { folderController } from "./folder.controller";
import { socketController } from "./socket.controller";

export const app = new Hono()
  .use("*", cors({ origin: env.FRONTEND_URL, credentials: true }))
  .get("/ws", socketController)
  .all("/", (ctx) => ctx.text("SkibidiWriter 🚽"))
  .route("/documents", documentController)
  .route("/folders", folderController);
