import { db } from "@/libs/db";
import { toFileShareDTO } from "@/mappers/file-share.mapper";
import { AuthEnv } from "@/middleware/session.middleware";
import { fileShareTable } from "@/models";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

export const fileShareController = new Hono<AuthEnv>().get("/", async (ctx) => {
  const userId = ctx.get("userId");

  const shares = await db
    .select()
    .from(fileShareTable)
    .where(eq(fileShareTable.userId, userId));

  return ctx.json(shares.map(toFileShareDTO));
});
