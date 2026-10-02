import { toast } from "@/components/ui/toast";
import { RECEIVED_SHARES_QUERY_KEY } from "@/hooks/use-file-shares";
import { CHAT_TOAST_TIMEOUT, messagePreview } from "@/lib/chat";
import { editPath, sharedPath } from "@/lib/paths";
import { realtime } from "@/lib/realtime";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { NotificationType, ServerEventType } from "skibidiwriter-shared";

export function useNotifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const messageToasts = new Map<string, { id: string; count: number }>();

    const unsubscribe = realtime.onEvent((event) => {
      if (event.type !== ServerEventType.Notification) return;

      const { notification } = event;

      switch (notification.type) {
        case NotificationType.File_Shared:
          void queryClient.invalidateQueries({
            queryKey: RECEIVED_SHARES_QUERY_KEY,
          });
          toast.add({
            title: "Nouveau partage",
            description: `${notification.sharedBy.name} a partagé « ${notification.fileName} » avec vous`,
            type: "info",
            actionProps: {
              children: "Voir",
              onClick: () => navigate(sharedPath()),
            },
          });
          break;
        case NotificationType.File_Unshared:
          void queryClient.invalidateQueries({
            queryKey: RECEIVED_SHARES_QUERY_KEY,
          });
          break;
        case NotificationType.Message_Received: {
          const { fileId, fileName, message } = notification;
          const previous = messageToasts.get(fileId);
          const count = (previous?.count ?? 0) + 1;
          const options = {
            title:
              count === 1
                ? `${message.author.name} · ${fileName}`
                : `${fileName} · ${count} nouveaux messages`,
            description: messagePreview(message.content),
            type: "info",
            timeout: CHAT_TOAST_TIMEOUT,
            actionProps: {
              children: "Ouvrir",
              onClick: () => navigate(editPath(fileId)),
            },
          };

          if (previous) {
            toast.update(previous.id, options);
            previous.count = count;
          } else {
            const id = toast.add({
              ...options,
              onClose: () => messageToasts.delete(fileId),
            });
            messageToasts.set(fileId, { id, count });
          }
          break;
        }
      }
    });

    return () => {
      unsubscribe();
      for (const { id } of messageToasts.values()) toast.close(id);
    };
  }, [navigate, queryClient]);
}
