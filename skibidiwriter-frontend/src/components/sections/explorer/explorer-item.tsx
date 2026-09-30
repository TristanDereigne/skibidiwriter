import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DownloadIcon,
  PencilIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { useEffect, useState } from "react";
import InlineNameInput from "@/components/shared/inline-name-input";
import ExplorerDeleteDialog from "./explorer-delete-dialog";
import {
  hasDragItem,
  ITEM_DRAG_TYPE,
  readDragItem,
  type DragItem,
} from "./drag-item";

interface Props {
  icon: LucideIcon;
  iconClassName: string;
  name: string;
  nameLabel: string;
  subtitle: string;
  startRenaming: boolean;
  deleteDescription: string;
  isDeleting: boolean;
  dragItem: DragItem;
  onDropItem?: (item: DragItem) => void;
  onOpen: () => void;
  onDownload?: () => void;
  onPrefetch?: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

export default function ExplorerItem({
  icon: Icon,
  iconClassName,
  name,
  nameLabel,
  subtitle,
  startRenaming,
  deleteDescription,
  isDeleting,
  dragItem,
  onDropItem,
  onOpen,
  onDownload,
  onPrefetch,
  onRename,
  onDelete,
}: Readonly<Props>) {
  const [renaming, setRenaming] = useState(startRenaming);

  useEffect(() => {
    if (startRenaming) setRenaming(true);
  }, [startRenaming]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const acceptsDrops = !!onDropItem;

  function canDrop(event: React.DragEvent) {
    return acceptsDrops && hasDragItem(event.dataTransfer);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (renaming || (event.target as HTMLElement).tagName === "INPUT") return;

    if (event.key === "F2") {
      event.preventDefault();
      setRenaming(true);
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      setDeleteOpen(true);
    }
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger
          render={
            <div
              className={cn(
                "group flex flex-col items-center gap-2 rounded-2xl border border-transparent p-3 text-center hover:bg-muted/40",
                startRenaming && "border-primary/40 bg-primary/5",
                dropActive && "border-primary bg-primary/10",
              )}
              tabIndex={-1}
              draggable={!renaming}
              onKeyDown={handleKeyDown}
              onDragStart={(event: React.DragEvent) => {
                event.dataTransfer.setData(
                  ITEM_DRAG_TYPE,
                  JSON.stringify(dragItem),
                );
                event.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(event: React.DragEvent) => {
                if (!canDrop(event)) return;
                event.preventDefault();
                event.stopPropagation();
                setDropActive(true);
              }}
              onDragLeave={() => setDropActive(false)}
              onDrop={(event: React.DragEvent) => {
                setDropActive(false);
                if (!canDrop(event)) return;
                event.preventDefault();
                event.stopPropagation();

                const item = readDragItem(event.dataTransfer);
                if (item) onDropItem?.(item);
              }}
              onPointerEnter={onPrefetch}
              onFocus={onPrefetch}
            />
          }
        >
          <button
            type="button"
            aria-label={`Open ${name}`}
            className="flex h-28 w-full items-center justify-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={onOpen}
            title={name}
          >
            <Icon strokeWidth={1} className={cn("size-24", iconClassName)} />
          </button>
          <div className="w-full">
            {renaming ? (
              <InlineNameInput
                className="text-center"
                name={name}
                label={nameLabel}
                onCommit={onRename}
                onDone={() => setRenaming(false)}
              />
            ) : (
              <button
                type="button"
                className="block w-full truncate rounded text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={onOpen}
              >
                {name}
              </button>
            )}
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setRenaming(true)}>
            <PencilIcon />
            Rename
          </ContextMenuItem>
          {onDownload && (
            <ContextMenuItem onClick={onDownload}>
              <DownloadIcon />
              Download
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <ExplorerDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete “${name}”?`}
        description={deleteDescription}
        isPending={isDeleting}
        onConfirm={onDelete}
      />
    </>
  );
}
