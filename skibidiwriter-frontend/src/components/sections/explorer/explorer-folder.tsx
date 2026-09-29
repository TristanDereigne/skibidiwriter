import { useDeleteFolder, useRenameFolder } from "@/hooks/use-folders";
import { explorerPath } from "@/lib/paths";
import { FolderIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { FolderDTO } from "skibidiwriter-shared";
import { useExplorer } from "./use-explorer";
import ExplorerItem from "./explorer-item";

interface Props {
  folder: FolderDTO;
}

export default function ExplorerFolder({ folder }: Readonly<Props>) {
  const { createdId } = useExplorer();
  const navigate = useNavigate();
  const renameFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();

  return (
    <ExplorerItem
      icon={FolderIcon}
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
