import { toast } from "@/components/ui/toast";
import { realtime } from "@/lib/realtime";
import { sharedPath } from "@/lib/paths";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ServerEventType } from "skibidiwriter-shared";

export function useNotifications() {
  const navigate = useNavigate();

  useEffect(
    () =>
      realtime.onEvent((event) => {
        if (event.type !== ServerEventType.Notification) return;

        const { fileName, sharedBy } = event.notification;

        toast.add({
          title: "Nouveau partage",
          description: `${sharedBy.name} a partagé « ${fileName} » avec vous`,
          type: "info",
          actionProps: {
            children: "Voir",
            onClick: () => navigate(sharedPath()),
          },
        });
      }),
    [navigate],
  );
}
