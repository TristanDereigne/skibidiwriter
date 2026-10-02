import { auth } from "@/libs/auth";
import { env } from "@/libs/env";
import { originMiddleware } from "@/middleware/origin.middleware";
import { sessionMiddleware } from "@/middleware/session.middleware";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { fileShareController } from "./file-share.controller";
import { fileController } from "./file.controller";
import { folderController } from "./folder.controller";
import { socketController } from "./socket.controller";
import { userController } from "./user.controller";

const protectedRoutes = new Hono()
  .use(csrf({ origin: env.FRONTEND_URL_NO_SLASH }))
  .use(sessionMiddleware)
  .route("/folders", folderController)
  .route("/files", fileController)
  .route("/file-shares", fileShareController)
  .route("/users", userController);

export const app = new Hono()
  .use(
    "*",
    cors({
      origin: env.FRONTEND_URL_NO_SLASH,
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Content-Disposition"],
      allowMethods: ["POST", "GET", "PUT", "PATCH", "OPTIONS", "DELETE"],
    }),
  )
  .get("/ws", originMiddleware, sessionMiddleware, socketController)
  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .all("/", (ctx) => ctx.text("SkibidiWriter 🚽"))
  .route("/", protectedRoutes);
