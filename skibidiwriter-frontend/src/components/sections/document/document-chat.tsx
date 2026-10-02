import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Separator } from "@/components/ui/separator";
import { useSkibidiChat } from "@/lib/chat";
import { participantColor } from "@/lib/participants";
import { useConnectionStatus } from "@/lib/realtime";
import { format } from "date-fns";
import { SendIcon, XIcon } from "lucide-react";
import { useState, type SubmitEventHandler } from "react";
import { MESSAGE_MAX_LENGTH } from "skibidiwriter-shared";

interface Props {
  documentId: string;
  onClose: () => void;
}

export default function DocumentChat({ documentId, onClose }: Readonly<Props>) {
  const status = useConnectionStatus();
  const { messages, sendMessage } = useSkibidiChat(documentId);
  const [draft, setDraft] = useState("");
  const text = draft.trim();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (text && sendMessage(text)) setDraft("");
  };

  return (
    <aside className="flex min-h-0 flex-col border-l bg-background max-lg:fixed max-lg:inset-0 max-lg:z-40 lg:w-80 lg:shrink-0">
      <div className="flex h-12 shrink-0 items-center justify-between pr-2 pl-4">
        <h2 className="text-sm font-semibold">Chat</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label="Fermer le chat"
          onClick={onClose}
        >
          <XIcon />
        </Button>
      </div>
      <Separator />
      <div className="min-h-0 flex-1">
        <MessageScrollerProvider autoScroll defaultScrollPosition="end">
          <MessageScroller>
            <MessageScrollerViewport aria-label="Messages">
              <MessageScrollerContent className="gap-3 p-4">
                {messages.map(({ id, author, content, createdAt }) => (
                  <MessageScrollerItem key={id} messageId={id}>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="truncate text-sm font-semibold"
                        style={{ color: participantColor(author.id) }}
                      >
                        {author.name}
                      </span>
                      <time
                        dateTime={createdAt}
                        className="text-xs text-muted-foreground"
                      >
                        {format(createdAt, "HH:mm")}
                      </time>
                    </div>
                    <p className="text-sm wrap-break-word whitespace-pre-wrap">
                      {content}
                    </p>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
      <form onSubmit={handleSubmit} className="p-4 pt-2">
        <InputGroup>
          <InputGroupInput
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder="Écrire un message…"
            aria-label="Message"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="submit"
              size="icon-xs"
              disabled={status !== "connected" || !text}
              aria-label="Envoyer"
            >
              <SendIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </aside>
  );
}
