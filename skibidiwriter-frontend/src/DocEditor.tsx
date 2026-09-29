import { useEffect, useRef, useState } from "react";
import { useSkibidiDocument } from "./lib/document";

export function useDebounced<Value>(value: Value, delay = 300): Value {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
export default function DocEditor() {
  const composerRef = useRef<HTMLDivElement | null>(null);

  const { content, sendContent, status } = useSkibidiDocument();

  const [localContent, setLocalContent] = useState("");
  const debouncedContent = useDebounced(localContent, 400);

  useEffect(() => {
    sendContent(debouncedContent);
  }, [debouncedContent]);

  useEffect(() => {
    sendContent(localContent);
    setLocalContent(content);
  }, [content]);

  return status === "connected" ? (
    <div
      ref={composerRef}
      contentEditable
      className="aspect-[1/sqrt(2)] max-w-1/3 border mx-auto p-1"
      onInput={() => setLocalContent(composerRef.current?.innerText ?? "")}
    />
  ) : (
    "connecting/disconnected"
  );
}
