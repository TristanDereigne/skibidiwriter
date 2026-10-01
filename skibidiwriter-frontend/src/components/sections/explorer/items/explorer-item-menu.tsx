import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DownloadIcon,
  InfoIcon,
  PencilIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";

interface Props {
  onRename: VoidFunction;
  onDownload?: VoidFunction;
  onShare: VoidFunction;
  onDelete: VoidFunction;
  onInfo: VoidFunction;
}

export default function ExplorerItemMenu({
  onRename,
  onDownload,
  onShare,
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
      <ContextMenuItem onClick={onShare}>
        <UserPlusIcon />
        Partager
      </ContextMenuItem>
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
