import { useState, type SubmitEventHandler } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useSkibidiChat } from "./lib/skibidi-chat";

export default function Chat() {
  const [draft, setDraft] = useState("");
  const { messages, sendMessage } = useSkibidiChat();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();

    const content = draft.trim();
    if (!content) return;

    sendMessage(content);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {messages.map((message) => (
          <article key={message.id}>{message.content}</article>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="flex gap-1">
        <Input
          value={draft}
          onChange={(ev) => setDraft(ev.target.value)}
          placeholder="Message.."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
