import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { DownloadIcon, InfoIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface Props {
  onRename: () => void;
  onDownload?: () => void;
  onDelete: () => void;
  onInfo: () => void;
}

export default function ExplorerItemMenu({
  onRename,
  onDownload,
  onDelete,
  onInfo,
}: Readonly<Props>) {
  return (
    <ContextMenuContent>
      <ContextMenuItem onClick={onRename}>
        <PencilIcon />
        Renommer
      </ContextMenuItem>
      {onDownload && (
        <ContextMenuItem onClick={onDownload}>
          <DownloadIcon />
          Télécharger
        </ContextMenuItem>
      )}
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive" onClick={onDelete}>
        <Trash2Icon />
        Supprimer
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onInfo}>
        <InfoIcon />
        Informations
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
