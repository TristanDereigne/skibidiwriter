import { useMoveFile } from "@/hooks/use-files";
import {
  useDeleteFolder,
  useFolderStats,
  useMoveFolder,
  useRenameFolder,
} from "@/hooks/use-folders";
import { toast } from "@/components/ui/toast";
import { useState } from "react";
import { dateTimeFormat, formatBytes } from "@/lib/format";
import { explorerPath } from "@/lib/paths";
import { FolderIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { FolderDTO } from "skibidiwriter-shared";
import { useExplorer } from "../context/use-explorer";
import type { DragItem } from "../drag/drag-item";
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
  const [infoOpen, setInfoOpen] = useState(false);
  const { data: stats } = useFolderStats(folder.id, infoOpen);

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
    <ExplorerItem
      icon={FolderIcon}
      iconClassName="fill-amber-400/25 text-amber-500"
      dragItem={{ kind: "folder", id: folder.id }}
      onDropItem={handleDrop}
      name={folder.name}
      nameLabel="Nom du dossier"
      subtitle="Dossier"
      infoRows={[
        { label: "Type", value: "Dossier" },
        {
          label: "Créé le",
          value: dateTimeFormat.format(new Date(folder.createdAt)),
        },
        {
          label: "Modifié le",
          value: dateTimeFormat.format(new Date(folder.updatedAt)),
        },
        {
          label: "Fichiers",
          value: stats ? String(stats.fileCount) : "…",
        },
        {
          label: "Taille totale",
          value: stats ? formatBytes(stats.totalBytes) : "…",
        },
      ]}
      onInfoOpenChange={setInfoOpen}
      startRenaming={folder.id === createdId}
      deleteDescription="Ce dossier et tout son contenu seront supprimés définitivement. Cette action est irréversible."
      isDeleting={deleteFolder.isPending}
      onOpen={() => navigate(explorerPath(folder.id))}
      onRename={(name) => renameFolder.mutate({ id: folder.id, name })}
      onDelete={() => deleteFolder.mutate(folder.id)}
    />
  );
}
