import { env } from "@/libs/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { fileController } from "./file.controller";
import { folderController } from "./folder.controller";
import { socketController } from "./socket.controller";
import { auth } from "@/libs/auth";
import { requireAuth } from "@/libs/require-auth";

const protectedRoutes = new Hono()
  .use(requireAuth)
  .route("/folders", folderController)
  .route("/files", fileController);

// Must be mounted after the public routes: its pathless `use` becomes `/*`.
export const app = new Hono()
  .use(
    "*",
    cors({
      origin: env.FRONTEND_URL_NO_SLASH,
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "PATCH", "OPTIONS", "DELETE"],
    }),
  )
  .get("/ws", requireAuth, socketController)
  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .all("/", (ctx) => ctx.text("SkibidiWriter 🚽"))
  .route("/", protectedRoutes);
