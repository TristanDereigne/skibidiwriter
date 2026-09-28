import type { AppType } from "@skibidiwriter/backend";
import { hc } from "hono/client";

export const api = hc<AppType>(import.meta.env.VITE_API_URL, {
  init: { credentials: "include" },
});
