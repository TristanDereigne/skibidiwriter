import { useMoveDocument } from "@/hooks/use-documents";
import {
  useDeleteFolder,
  useMoveFolder,
  useRenameFolder,
} from "@/hooks/use-folders";
import { toast } from "@/components/ui/toast";
import { explorerPath } from "@/lib/paths";
import { FolderIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { FolderDTO } from "skibidiwriter-shared";
import { useExplorer } from "./use-explorer";
import type { DragItem } from "./drag-item";
import ExplorerItem from "./explorer-item";

interface Props {
  folder: FolderDTO;
}

export default function ExplorerFolder({ folder }: Readonly<Props>) {
  const { createdId } = useExplorer();
  const navigate = useNavigate();
  const renameFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();
  const moveFolder = useMoveFolder();
  const moveDocument = useMoveDocument();

  function handleDrop(item: DragItem) {
    const onError = (error: Error) =>
      toast.add({
        title: "Couldn’t move",
        description: error.message,
        type: "error",
      });

    if (item.kind === "document") {
      moveDocument.mutate({ id: item.id, folderId: folder.id }, { onError });
    } else if (item.id !== folder.id) {
      moveFolder.mutate({ id: item.id, parentId: folder.id }, { onError });
    }
  }

  return (
    <ExplorerItem
      icon={FolderIcon}
      iconClassName="fill-amber-400/25 text-amber-500"
      dragItem={{ kind: "folder", id: folder.id }}
      onDropItem={handleDrop}
      name={folder.name}
      nameLabel="Folder name"
      subtitle="Folder"
      startRenaming={folder.id === createdId}
      deleteDescription="This folder and everything inside it will be permanently deleted. This can’t be undone."
      isDeleting={deleteFolder.isPending}
      onOpen={() => navigate(explorerPath(folder.id))}
      onRename={(name) => renameFolder.mutate({ id: folder.id, name })}
      onDelete={() => deleteFolder.mutate(folder.id)}
    />
  );
}
