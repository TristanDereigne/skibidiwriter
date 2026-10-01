import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { DownloadIcon, ExternalLinkIcon } from "lucide-react";

interface Props {
  isDocument: boolean;
  onOpen: () => void;
  onDownload: () => void;
}

export default function SharedFileMenu({
  isDocument,
  onOpen,
  onDownload,
}: Readonly<Props>) {
  return (
    <ContextMenuContent>
      {isDocument && (
        <ContextMenuItem onClick={onOpen}>
          <ExternalLinkIcon />
          Ouvrir
        </ContextMenuItem>
      )}
      <ContextMenuItem onClick={onDownload}>
        <DownloadIcon />
        Télécharger
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
