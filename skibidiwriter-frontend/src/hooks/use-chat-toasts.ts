import { toast } from "@/components/ui/toast";
import { useSkibidiChat, useUnreadMessages } from "@/lib/chat";
import { isDesktop } from "@/lib/viewport";
import { useEffect, useRef } from "react";

const TOAST_TIMEOUT = 4000;
const PREVIEW_LENGTH = 80;

export function useChatToasts(
  documentId: string,
  isChatOpen: boolean,
  openChat: () => void,
) {
  const unread = useUnreadMessages(documentId);
  const { messages } = useSkibidiChat(documentId);
  const latest = messages.at(-1);
  const toastId = useRef<string>(undefined);

  useEffect(() => {
    if (isChatOpen || unread === 0) {
      if (toastId.current) toast.close(toastId.current);
      return;
    }

    if (!latest || !isDesktop() || document.hidden) return;

    const content =
      latest.content.length > PREVIEW_LENGTH
        ? `${latest.content.slice(0, PREVIEW_LENGTH)}…`
        : latest.content;
    const options = {
      title:
        unread === 1
          ? latest.author.name
          : `${latest.author.name} · ${unread} nouveaux messages`,
      description: content,
      type: "info",
      timeout: TOAST_TIMEOUT,
      actionProps: { children: "Ouvrir", onClick: openChat },
    };

    if (toastId.current) toast.update(toastId.current, options);
    else {
      toastId.current = toast.add({
        ...options,
        onClose: () => {
          toastId.current = undefined;
        },
      });
    }
  }, [isChatOpen, unread, latest, openChat]);

  useEffect(
    () => () => {
      if (toastId.current) toast.close(toastId.current);
    },
    [],
  );
}
