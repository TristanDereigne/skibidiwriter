import { db } from "@/libs/db";
import { isConnected, send, sendToUser } from "@/libs/socket";
import { notificationTable } from "@/models";
import { and, eq } from "drizzle-orm";
import type { WSContext } from "hono/ws";
import { ServerEventType, type NotificationDTO } from "skibidiwriter-shared";

async function notify(userId: string, notification: NotificationDTO) {
  if (isConnected(userId)) {
    sendToUser(userId, { type: ServerEventType.Notification, notification });
    return;
  }

  await db.insert(notificationTable).values({
    userId,
    fileId: notification.fileId,
    payload: notification,
  });
}

async function deliverPending(ws: WSContext, userId: string) {
  const rows = await db
    .delete(notificationTable)
    .where(eq(notificationTable.userId, userId))
    .returning();

  rows.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  for (const row of rows) {
    send(ws, {
      type: ServerEventType.Notification,
      notification: row.payload,
    });
  }
}

async function discard(userId: string, fileId: string) {
  await db
    .delete(notificationTable)
    .where(
      and(
        eq(notificationTable.userId, userId),
        eq(notificationTable.fileId, fileId),
      ),
    );
}

export default { notify, deliverPending, discard };
