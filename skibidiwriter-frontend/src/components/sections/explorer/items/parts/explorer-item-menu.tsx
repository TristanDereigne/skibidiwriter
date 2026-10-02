import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DownloadIcon,
  InfoIcon,
  PencilIcon,
  ReplaceIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";
import { useExplorerItem } from "../context/use-explorer-item";

interface Props {
  isShareable: boolean;
  onDownload?: VoidFunction;
  onReplace?: VoidFunction;
}

export default function ExplorerItemMenu({
  isShareable,
  onDownload,
  onReplace,
}: Readonly<Props>) {
  const { startRenaming, shareDialog, deleteDialog, infoDialog } =
    useExplorerItem();

  return (
    <ContextMenuContent>
      <ContextMenuItem onClick={startRenaming}>
        <PencilIcon />
        Renommer
      </ContextMenuItem>
      {onDownload && (
        <ContextMenuItem onClick={onDownload}>
          <DownloadIcon />
          Télécharger
        </ContextMenuItem>
      )}
      {onReplace && (
        <ContextMenuItem onClick={onReplace}>
          <ReplaceIcon />
          Remplacer
        </ContextMenuItem>
      )}
      {isShareable && (
        <ContextMenuItem onClick={shareDialog.open}>
          <UserPlusIcon />
          Partager
        </ContextMenuItem>
      )}
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive" onClick={deleteDialog.open}>
        <Trash2Icon />
        Supprimer
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={infoDialog.open}>
        <InfoIcon />
        Informations
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
