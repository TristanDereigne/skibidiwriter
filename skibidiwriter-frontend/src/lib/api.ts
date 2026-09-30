import { hc } from "hono/client";
import type { AppType } from "skibidiwriter-backend";

export const api = hc<AppType>(import.meta.env.VITE_API_URL, {
  init: { credentials: "include" },
});

export async function errorMessage(res: Response, fallback: string) {
  const body = (await res.json().catch(() => null)) as {
    error?: string;
  } | null;

  return body?.error ?? fallback;
}
