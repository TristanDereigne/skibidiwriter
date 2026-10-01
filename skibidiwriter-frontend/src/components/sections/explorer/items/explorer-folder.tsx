import { toast } from "@/components/ui/toast";
import { useMoveFile } from "@/hooks/use-files";
import {
  useDeleteFolder,
  useMoveFolder,
  useRenameFolder,
} from "@/hooks/use-folders";
import { explorerPath } from "@/lib/paths";
import { FolderIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { FolderDTO } from "skibidiwriter-shared";
import { useExplorer } from "../context/use-explorer";
import type { DragItem } from "../drag/drag-item";
import ExplorerItemProvider from "./context/explorer-item-provider";
import ExplorerDeleteDialog from "./dialogs/explorer-delete-dialog";
import ExplorerFolderInfoDialog from "./dialogs/explorer-folder-info-dialog";
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
  const moveFile = useMoveFile();

  function handleDrop(item: DragItem) {
    const onError = (error: Error) =>
      toast.add({
        title: "Déplacement impossible",
        description: error.message,
        type: "error",
      });

    if (item.kind === "file") {
      moveFile.mutate({ id: item.id, folderId: folder.id }, { onError });
    } else if (item.id !== folder.id) {
      moveFolder.mutate({ id: item.id, parentId: folder.id }, { onError });
    }
  }

  return (
    <ExplorerItemProvider
      name={folder.name}
      isJustCreated={folder.id === createdId}
    >
      <ExplorerItem
        icon={FolderIcon}
        iconClassName="fill-amber-400/25 text-amber-500"
        dragItem={{ kind: "folder", id: folder.id }}
        onDropItem={handleDrop}
        nameLabel="Nom du dossier"
        subtitle="Dossier"
        onOpen={() => navigate(explorerPath(folder.id))}
        onRename={(name) => renameFolder.mutate({ id: folder.id, name })}
      />

      <ExplorerDeleteDialog
        description="Ce dossier et tout son contenu seront supprimés définitivement. Cette action est irréversible."
        isPending={deleteFolder.isPending}
        onConfirm={() => deleteFolder.mutate(folder.id)}
      />
      <ExplorerFolderInfoDialog folder={folder} />
    </ExplorerItemProvider>
  );
}
