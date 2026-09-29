import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLayoutEffect, useRef } from "react";
import { diffText, mapCursor } from "skibidiwriter-shared";
import { useSkibidiDocument } from "./lib/document";
import { CONNECTION_STATUS_LABELS } from "./lib/realtime";

export default function DocEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { status, text, edit } = useSkibidiDocument();

  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea || textarea.value === text) return;

    const change = diffText(textarea.value, text);
    const selectionStart = mapCursor(textarea.selectionStart, change);
    const selectionEnd = mapCursor(textarea.selectionEnd, change);

    textarea.value = text;
    textarea.setSelectionRange(selectionStart, selectionEnd);
  }, [text]);

  return (
    <Card className="mx-auto h-[32rem] w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Skibidi document</CardTitle>
        <CardAction>
          <Badge variant={status === "connected" ? "secondary" : "outline"}>
            {CONNECTION_STATUS_LABELS[status]}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <textarea
          ref={textareaRef}
          aria-label="Document"
          placeholder="Start writing…"
          className="size-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
          onInput={(event) => edit(event.currentTarget.value)}
        />
      </CardContent>
    </Card>
  );
}
