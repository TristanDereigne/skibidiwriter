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
  shouldStartRenaming: boolean;
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
  shouldStartRenaming,
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
  const [isRenaming, setIsRenaming] = useState(shouldStartRenaming);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpenState] = useState(false);
  const { isDropActive, dragProps } = useItemDrag({
    dragItem,
    isDraggable: !isRenaming,
    onDropItem,
  });

  useEffect(() => {
    if (shouldStartRenaming) setIsRenaming(true);
  }, [shouldStartRenaming]);

  function setIsInfoOpen(open: boolean) {
    setIsInfoOpenState(open);
    onInfoOpenChange?.(open);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (isRenaming || (event.target as HTMLElement).tagName === "INPUT") return;

    if (event.key === "F2") {
      event.preventDefault();
      setIsRenaming(true);
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      setIsDeleteOpen(true);
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
                shouldStartRenaming && "border-primary/40 bg-primary/5",
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
            isRenaming={isRenaming}
            onOpen={onOpen}
            onRename={onRename}
            onRenameDone={() => setIsRenaming(false)}
          />
        </ContextMenuTrigger>
        <ExplorerItemMenu
          onRename={() => setIsRenaming(true)}
          onDownload={onDownload}
          onShare={() => setIsShareOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
          onInfo={() => setIsInfoOpen(true)}
        />
      </ContextMenu>

      <ExplorerDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title={`Supprimer "${name}" ?`}
        description={deleteDescription}
        isPending={isDeleting}
        onConfirm={onDelete}
      />

      <ExplorerInfoDialog
        open={isInfoOpen}
        onOpenChange={setIsInfoOpen}
        title={`Informations de "${name}"`}
        rows={infoRows}
      />

      <ExplorerShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        fileName={name}
      />
    </>
  );
}
