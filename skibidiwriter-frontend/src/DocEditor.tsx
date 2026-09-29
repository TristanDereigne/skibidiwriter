import { useLayoutEffect, useRef } from "react";
import { diffText, mapCursor } from "skibidiwriter-shared";
import { useSkibidiDocument } from "./lib/document";

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
    <div className="aspect-[1/sqrt(2)] max-w-1/3 border mx-auto p-1">
      <textarea
        ref={textareaRef}
        className="size-full resize-none outline-none"
        onInput={(event) => edit(event.currentTarget.value)}
      />
      {status !== "connected" && <p>Offline, changes will sync on reconnect</p>}
    </div>
  );
}
