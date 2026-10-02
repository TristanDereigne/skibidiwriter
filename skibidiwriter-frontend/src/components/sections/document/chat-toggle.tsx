import { Button } from "@/components/ui/button";
import { markChatRead, useUnreadMessages } from "@/lib/chat";
import { MessageSquareIcon } from "lucide-react";
import { useEffect } from "react";

interface Props {
  documentId: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatToggle({
  documentId,
  isOpen,
  onToggle,
}: Readonly<Props>) {
  const unread = useUnreadMessages(documentId);

  useEffect(() => {
    if (isOpen && unread > 0) markChatRead(documentId);
  }, [documentId, isOpen, unread]);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="relative text-muted-foreground"
      aria-label="Afficher le chat"
      title="Afficher le chat"
      onClick={onToggle}
    >
      <MessageSquareIcon />
      {!isOpen && unread > 0 && (
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Button>
  );
}
