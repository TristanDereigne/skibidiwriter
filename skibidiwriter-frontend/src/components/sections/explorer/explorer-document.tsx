import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FileTextIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { DocumentDTO } from "skibidiwriter-shared";
import DeleteDocumentDialog from "./delete-document-dialog";
import ExplorerDocumentNameInput from "./explorer-document-name";

interface Props {
  document: DocumentDTO;
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function ExplorerDocument({ document }: Readonly<Props>) {
  const navigate = useNavigate();
  const [renaming, setRenaming] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const open = () => navigate(`/edit/${document.id}`);

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
            aria-label={`Open ${document.name}`}
            className="flex aspect-3/4 w-full items-center justify-center rounded-lg border bg-card shadow-sm transition-shadow outline-none group-hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={open}
          >
            <FileTextIcon className="size-10 text-muted-foreground" />
          </button>
          <div className="w-full">
            {renaming ? (
              <ExplorerDocumentNameInput
                document={document}
                onDone={() => setRenaming(false)}
              />
            ) : (
              <button
                type="button"
                className="block w-full truncate rounded text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={open}
              >
                {document.name}
              </button>
            )}
            <p className="text-xs text-muted-foreground">
              {dateFormat.format(new Date(document.updatedAt))}
            </p>
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
      <DeleteDocumentDialog
        document={document}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
