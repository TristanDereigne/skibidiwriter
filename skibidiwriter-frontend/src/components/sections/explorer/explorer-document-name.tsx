import { Input } from "@/components/ui/input";
import { useRenameDocument } from "@/hooks/use-documents";
import { useEffect, useRef, useState } from "react";
import type { DocumentDTO } from "skibidiwriter-shared";

interface Props {
  document: DocumentDTO;
  onDone: () => void;
}

export default function ExplorerDocumentNameInput({
  document,
  onDone,
}: Readonly<Props>) {
  const renameDocument = useRenameDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const finished = useRef(false);
  const [name, setName] = useState(document.name);

  // Wait a frame so the context menu closing doesn't steal focus back.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const finish = (commit: boolean) => {
    if (finished.current) return;
    finished.current = true;

    const trimmed = name.trim();
    if (commit && trimmed && trimmed !== document.name) {
      renameDocument.mutate({ id: document.id, name: trimmed });
    }

    onDone();
  };

  return (
    <Input
      ref={inputRef}
      aria-label="Document name"
      value={name}
      maxLength={255}
      className="h-6 px-1 text-center text-sm font-medium md:text-sm"
      onChange={(event) => setName(event.target.value)}
      onClick={(event) => event.stopPropagation()}
      onBlur={() => finish(true)}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Enter") finish(true);
        if (event.key === "Escape") finish(false);
      }}
    />
  );
}
