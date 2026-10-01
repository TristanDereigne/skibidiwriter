import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "cn";
import { type LucideIcon } from "lucide-react";
import type { KeyboardEvent } from "react";
import { type DragItem } from "../drag/drag-item";
import { useItemDrag } from "../drag/use-item-drag";
import { useExplorerItem } from "./context/use-explorer-item";
import ExplorerItemIcon from "./parts/explorer-item-icon";
import ExplorerItemLabel from "./parts/explorer-item-label";
import ExplorerItemMenu from "./parts/explorer-item-menu";

interface Props {
  icon: LucideIcon;
  iconClassName: string;
  nameLabel: string;
  subtitle: string;
  isShareable?: boolean;
  dragItem: DragItem;
  onDropItem?: (item: DragItem) => void;
  onOpen: () => void;
  onPrefetch?: () => void;
  onRename: (name: string) => void;
  onDownload?: () => void;
}

export default function ExplorerItem({
  icon,
  iconClassName,
  nameLabel,
  subtitle,
  isShareable = false,
  dragItem,
  onDropItem,
  onOpen,
  onPrefetch,
  onRename,
  onDownload,
}: Readonly<Props>) {
  const { isJustCreated, isRenaming, startRenaming, deleteDialog } =
    useExplorerItem();
  const { isDropActive, dragProps } = useItemDrag({
    dragItem,
    isDraggable: !isRenaming,
    onDropItem,
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (isRenaming || (event.target as HTMLElement).tagName === "INPUT") return;

    if (event.key === "F2") {
      event.preventDefault();
      startRenaming();
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      deleteDialog.open();
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <div
            className={cn(
              "group flex flex-col items-center gap-2 rounded-2xl border border-transparent p-3 text-center hover:bg-muted/40",
              isJustCreated && "border-primary/40 bg-primary/5",
              isDropActive && "border-primary bg-primary/10",
            )}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            onPointerEnter={onPrefetch}
            onFocus={onPrefetch}
            {...dragProps}
          />
        }
      >
        <ExplorerItemIcon
          icon={icon}
          iconClassName={iconClassName}
          onOpen={onOpen}
        />
        <ExplorerItemLabel
          nameLabel={nameLabel}
          subtitle={subtitle}
          onOpen={onOpen}
          onRename={onRename}
        />
      </ContextMenuTrigger>
      <ExplorerItemMenu isShareable={isShareable} onDownload={onDownload} />
    </ContextMenu>
  );
}
