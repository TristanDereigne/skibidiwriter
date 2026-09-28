import "@/libs/env";

import { env } from "@/libs/env";
import { websocket } from "@hono/bun";
import { app } from "./controllers";

export type AppType = typeof app;

export default {
  port: env.PORT,
  fetch: app.fetch,
  websocket,
};
