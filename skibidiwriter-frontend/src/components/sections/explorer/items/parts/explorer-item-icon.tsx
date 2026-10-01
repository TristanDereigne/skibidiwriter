import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import { useExplorerItem } from "../context/use-explorer-item";

interface Props {
  icon: LucideIcon;
  iconClassName: string;
  onOpen: () => void;
}

export default function ExplorerItemIcon({
  icon: Icon,
  iconClassName,
  onOpen,
}: Readonly<Props>) {
  const { name } = useExplorerItem();

  return (
    <button
      type="button"
      aria-label={`Ouvrir ${name}`}
      className="flex h-28 w-full items-center justify-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      onClick={onOpen}
      title={name}
    >
      <Icon strokeWidth={1} className={cn("size-24", iconClassName)} />
    </button>
  );
}
