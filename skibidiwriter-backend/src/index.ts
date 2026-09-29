import { env } from "./libs/env";
import { app } from "./controllers";
import {websocket} from "@hono/bun";

export type AppType = typeof app;

export default {
  port: env.PORT,
  fetch: app.fetch,
  websocket,
};