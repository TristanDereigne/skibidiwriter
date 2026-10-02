import { toast } from "@/components/ui/toast";
import { RECEIVED_SHARES_QUERY_KEY } from "@/hooks/use-file-shares";
import { sharedPath } from "@/lib/paths";
import { realtime } from "@/lib/realtime";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { NotificationType, ServerEventType } from "skibidiwriter-shared";

export function useNotifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(
    () =>
      realtime.onEvent((event) => {
        if (event.type !== ServerEventType.Notification) return;

        const { notification } = event;

        void queryClient.invalidateQueries({
          queryKey: RECEIVED_SHARES_QUERY_KEY,
        });

        if (notification.type !== NotificationType.File_Shared) return;

        toast.add({
          title: "Nouveau partage",
          description: `${notification.sharedBy.name} a partagé "${notification.fileName}" avec vous`,
          type: "info",
          actionProps: {
            children: "Voir",
            onClick: () => navigate(sharedPath()),
          },
        });
      }),
    [navigate, queryClient],
  );
}
