import { websocket } from "@hono/bun";
import { app } from "./controllers";
import { env } from "./libs/env";

export type AppType = typeof app;

export default {
  port: env.PORT,
  fetch: app.fetch,
  websocket,
};
