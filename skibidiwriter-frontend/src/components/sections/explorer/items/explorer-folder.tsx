import { useDeleteFolder, useRenameFolder } from "@/hooks/use-folders";
import { explorerPath } from "@/lib/paths";
import { FolderIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { FolderDTO } from "skibidiwriter-shared";
import { useExplorer } from "../context/use-explorer";
import { useMoveItem } from "../drag/use-move-item";
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
  const moveItem = useMoveItem();

  return (
    <ExplorerItemProvider
      name={folder.name}
      isJustCreated={folder.id === createdId}
    >
      <ExplorerItem
        icon={FolderIcon}
        iconClassName="fill-amber-400/25 text-amber-500"
        dragItem={{ kind: "folder", id: folder.id }}
        onDropItem={(item) => moveItem(item, folder.id)}
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
