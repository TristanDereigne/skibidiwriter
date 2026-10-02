import { hc } from "hono/client";
import type { AppType } from "skibidiwriter-backend";
import type { ErrorDTO } from "skibidiwriter-shared";
import { getErrorMessage } from "./errors";

export const api = hc<AppType>(import.meta.env.VITE_API_URL, {
  init: { credentials: "include" },
});

export async function errorMessage(res: Response, fallback: string) {
  const body = (await res.json().catch(() => null)) as Partial<ErrorDTO> | null;

  return getErrorMessage(body?.code, fallback);
}

export async function unwrap<T extends Response>(
  request: Promise<T>,
  fallback: string,
) {
  const res = await request;
  if (!res.ok) throw new Error(await errorMessage(res, fallback));

  return res as Exclude<T, { ok: false }>;
}
