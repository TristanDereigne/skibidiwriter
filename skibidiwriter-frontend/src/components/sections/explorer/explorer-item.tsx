import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PencilIcon, Trash2Icon, type LucideIcon } from "lucide-react";
import { useState } from "react";
import ExplorerDeleteDialog from "./explorer-delete-dialog";
import ExplorerNameInput from "./explorer-name-input";

interface Props {
  icon: LucideIcon;
  name: string;
  nameLabel: string;
  subtitle: string;
  startRenaming: boolean;
  deleteDescription: string;
  isDeleting: boolean;
  onOpen: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

export default function ExplorerItem({
  icon: Icon,
  name,
  nameLabel,
  subtitle,
  startRenaming,
  deleteDescription,
  isDeleting,
  onOpen,
  onRename,
  onDelete,
}: Readonly<Props>) {
  const [renaming, setRenaming] = useState(startRenaming);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger
          render={
            <div className="group flex flex-col items-center gap-2 rounded-xl p-2 text-center" />
          }
        >
          <button
            type="button"
            aria-label={`Open ${name}`}
            className="flex h-28 w-full items-center justify-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={onOpen}
          >
            <Icon
              strokeWidth={1}
              className="size-24 fill-primary/15 text-primary transition-transform group-hover:scale-105"
            />
          </button>
          <div className="w-full">
            {renaming ? (
              <ExplorerNameInput
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
