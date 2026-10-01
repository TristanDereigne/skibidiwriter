import { useFolderStats } from "@/hooks/use-folders";
import { dateTimeFormat, formatBytes } from "@/lib/format";
import type { FolderDTO } from "skibidiwriter-shared";
import { useExplorerItem } from "../context/use-explorer-item";
import ExplorerInfoDialog from "./explorer-info-dialog";

interface Props {
  folder: FolderDTO;
}

export default function ExplorerFolderInfoDialog({
  folder,
}: Readonly<Props>) {
  const { infoDialog } = useExplorerItem();
  const { data: stats } = useFolderStats(folder.id, infoDialog.isOpen);

  return (
    <ExplorerInfoDialog
      rows={[
        { label: "Type", value: "Dossier" },
        {
          label: "Créé le",
          value: dateTimeFormat.format(new Date(folder.createdAt)),
        },
        {
          label: "Modifié le",
          value: dateTimeFormat.format(new Date(folder.updatedAt)),
        },
        { label: "Fichiers", value: stats ? String(stats.fileCount) : "…" },
        {
          label: "Taille totale",
          value: stats ? formatBytes(stats.totalBytes) : "…",
        },
      ]}
    />
  );
}
