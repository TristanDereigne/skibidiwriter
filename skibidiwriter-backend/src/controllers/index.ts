import { env } from "@/libs/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { chatSocket } from "./chat.controller";
import { exampleController } from "./example.controller";

export const app = new Hono()
  .use("*", cors({ origin: env.FRONTEND_URL, credentials: true }))
  .get("/ws", chatSocket)
  .all("/", (ctx) => ctx.text("SkibidiWriter 🚽"))
  .route("/examples", exampleController);
