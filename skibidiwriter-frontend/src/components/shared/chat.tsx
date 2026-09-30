import { Badge } from "@/components/ui/badge.tsx";
import { Bubble, BubbleContent } from "@/components/ui/bubble.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group.tsx";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message.tsx";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller.tsx";
import { format } from "date-fns";
import { SendIcon } from "lucide-react";
import { useState, type SubmitEventHandler } from "react";
import {
  MESSAGE_MAX_LENGTH,
  type MessageDTO,
} from "../../../../skibidiwriter-shared";
import { useSkibidiChat } from "../../lib/chat.ts";
import { CONNECTION_STATUS_LABELS } from "../../lib/realtime.ts";

export default function Chat() {
  const { status, messages, sendMessage } = useSkibidiChat();

  return (
    <Card className="mx-auto h-[32rem] w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Skibidi chat</CardTitle>
        <CardAction>
          <Badge variant={status === "connected" ? "secondary" : "outline"}>
            {CONNECTION_STATUS_LABELS[status]}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <ChatMessages messages={messages} />
      </CardContent>
      <CardFooter>
        <ChatComposer disabled={status !== "connected"} onSend={sendMessage} />
      </CardFooter>
    </Card>
  );
}

function ChatMessages({ messages }: { messages: MessageDTO[] }) {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller>
        <MessageScrollerViewport aria-label="Messages">
          <MessageScrollerContent className="gap-3">
            {messages.map((message) => (
              <MessageScrollerItem key={message.id} messageId={message.id}>
                <Message>
                  <MessageContent>
                    <Bubble variant="muted">
                      <BubbleContent>{message.content}</BubbleContent>
                    </Bubble>
                    <MessageFooter>
                      <time dateTime={message.createdAt}>
                        {format(message.createdAt, "HH:mm")}
                      </time>
                    </MessageFooter>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}

function ChatComposer({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (content: string) => boolean;
}) {
  const [draft, setDraft] = useState("");
  const content = draft.trim();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();
    if (!content || disabled) return;

    const success = onSend(content);
    if (success) {
      setDraft("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <InputGroup>
        <InputGroupInput
          value={draft}
          onChange={(ev) => setDraft(ev.target.value)}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Message…"
          aria-label="Message"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText className="tabular-nums">
            {draft.length}/{MESSAGE_MAX_LENGTH}
          </InputGroupText>
          <InputGroupButton
            type="submit"
            size="icon-xs"
            disabled={disabled || !content}
            aria-label="Send"
          >
            <SendIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
