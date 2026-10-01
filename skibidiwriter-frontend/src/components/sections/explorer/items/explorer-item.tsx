import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "cn";
import { type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { type DragItem } from "../drag/drag-item";
import { useItemDrag } from "../drag/use-item-drag";
import ExplorerDeleteDialog from "./explorer-delete-dialog";
import ExplorerInfoDialog, { type InfoRow } from "./explorer-info-dialog";
import ExplorerItemLabel from "./explorer-item-label";
import ExplorerItemMenu from "./explorer-item-menu";
import ExplorerShareDialog from "./explorer-share-dialog";

interface Props {
  icon: LucideIcon;
  iconClassName: string;
  name: string;
  nameLabel: string;
  subtitle: string;
  infoRows: InfoRow[];
  onInfoOpenChange?: (open: boolean) => void;
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
  infoRows,
  onInfoOpenChange,
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [infoOpen, setInfoOpenState] = useState(false);
  const { dropActive, dragProps } = useItemDrag({
    dragItem,
    draggable: !renaming,
    onDropItem,
  });

  useEffect(() => {
    if (startRenaming) setRenaming(true);
  }, [startRenaming]);

  function setInfoOpen(open: boolean) {
    setInfoOpenState(open);
    onInfoOpenChange?.(open);
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
              onKeyDown={handleKeyDown}
              onPointerEnter={onPrefetch}
              onFocus={onPrefetch}
              {...dragProps}
            />
          }
        >
          <button
            type="button"
            aria-label={`Ouvrir ${name}`}
            className="flex h-28 w-full items-center justify-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={onOpen}
            title={name}
          >
            <Icon strokeWidth={1} className={cn("size-24", iconClassName)} />
          </button>
          <ExplorerItemLabel
            name={name}
            nameLabel={nameLabel}
            subtitle={subtitle}
            renaming={renaming}
            onOpen={onOpen}
            onRename={onRename}
            onRenameDone={() => setRenaming(false)}
          />
        </ContextMenuTrigger>
        <ExplorerItemMenu
          onRename={() => setRenaming(true)}
          onDownload={onDownload}
          onShare={() => setShareOpen(true)}
          onDelete={() => setDeleteOpen(true)}
          onInfo={() => setInfoOpen(true)}
        />
      </ContextMenu>

      <ExplorerDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Supprimer "${name}" ?`}
        description={deleteDescription}
        isPending={isDeleting}
        onConfirm={onDelete}
      />

      <ExplorerInfoDialog
        open={infoOpen}
        onOpenChange={setInfoOpen}
        title={`Informations de "${name}"`}
        rows={infoRows}
      />

      <ExplorerShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        title={`Partager "${name}"`}
      />
    </>
  );
}
