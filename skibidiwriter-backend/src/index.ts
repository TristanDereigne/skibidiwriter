import "@/libs/env";

import { env } from "@/libs/env";
import { app } from "./controllers";

export type AppType = typeof app;

export default {
  port: env.PORT,
  fetch: app.fetch,
};