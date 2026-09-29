import { env } from "@/libs/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { documentController } from "./document.controller";
import { folderController } from "./folder.controller";
import { socketController } from "./socket.controller";
import { auth } from "@/libs/auth";

export const app = new Hono()
  .use(
    "*",
    cors({
      origin: env.FRONTEND_URL_NO_SLASH,
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "DELETE"],
    }),
  )
  .get("/ws", socketController)
  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .all("/", (ctx) => ctx.text("SkibidiWriter 🚽"))
  .route("/documents", documentController)
  .route("/folders", folderController);
