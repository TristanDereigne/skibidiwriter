import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import { useEffect, useRef, useState } from "react";

interface Props {
  name: string;
  label: string;
  className?: string;
  onCommit: (name: string) => void;
  onDone: () => void;
}

export default function InlineNameInput({
  name: initialName,
  label,
  className,
  onCommit,
  onDone,
}: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const finished = useRef(false);
  const [name, setName] = useState(initialName);

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
    if (commit && trimmed && trimmed !== initialName) onCommit(trimmed);

    onDone();
  };

  return (
    <Input
      ref={inputRef}
      aria-label={label}
      value={name}
      maxLength={255}
      className={cn("h-6 px-1 text-sm font-medium md:text-sm", className)}
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
