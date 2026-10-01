import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { FilePlusIcon, FolderPlusIcon } from "lucide-react";
import { useExplorer } from "../context/use-explorer";

export default function ExplorerBackgroundMenu() {
  const { createFolder, createDocument } = useExplorer();

  return (
    <ContextMenuContent>
      <ContextMenuItem onClick={createFolder}>
        <FolderPlusIcon />
        Nouveau dossier
      </ContextMenuItem>
      <ContextMenuItem onClick={createDocument}>
        <FilePlusIcon />
        Nouveau fichier
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
