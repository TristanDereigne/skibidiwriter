import { hc } from "hono/client";
import type { AppType } from "skibidiwriter-backend";
import type { ErrorDTO } from "skibidiwriter-shared";
import { getErrorMessage } from "./errors";

export const api = hc<AppType>(import.meta.env.VITE_API_URL, {
  init: { credentials: "include" },
});

export class ApiError extends Error {
  readonly code: string | undefined;

  constructor(message: string, code: string | undefined) {
    super(message);
    this.code = code;
  }
}

async function readError(res: Response, fallback: string) {
  const body = (await res.json().catch(() => null)) as Partial<ErrorDTO> | null;

  return new ApiError(getErrorMessage(body?.code, fallback), body?.code);
}

export async function errorMessage(res: Response, fallback: string) {
  return (await readError(res, fallback)).message;
}

export async function unwrap<T extends Response>(
  request: Promise<T>,
  fallback: string,
) {
  const res = await request;
  if (!res.ok) throw await readError(res, fallback);

  return res as Exclude<T, { ok: false }>;
}
