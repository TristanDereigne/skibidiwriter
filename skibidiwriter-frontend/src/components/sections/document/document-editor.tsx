import { useLayoutEffect, useRef } from "react";
import { diffText, mapCursor } from "skibidiwriter-shared";
import { useSkibidiDocument } from "../../../lib/document";

interface Props {
  documentId: string;
}

export default function DocumentEditor({ documentId }: Readonly<Props>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { text, edit } = useSkibidiDocument(documentId);

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
    <textarea
      ref={textareaRef}
      aria-label="Document"
      placeholder="Commencez à écrire…"
      className="size-full resize-none bg-transparent text-base leading-relaxed outline-none placeholder:text-muted-foreground"
      onInput={(event) => edit(event.currentTarget.value)}
    />
  );
}
