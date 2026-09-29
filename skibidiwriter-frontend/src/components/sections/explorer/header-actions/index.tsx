import { Button } from "@/components/ui/button";
import { FilePlusIcon, FolderPlusIcon } from "lucide-react";
import { useExplorer } from "../use-explorer";
import UploadFileAction from "./upload-file-action";

export default function ExplorerHeaderActions() {
  const { folderId, createDocument, createFolder } = useExplorer();

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        aria-label="New folder"
        title="New folder"
        onClick={createFolder}
      >
        <FolderPlusIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        aria-label="New document"
        title="New document"
        onClick={createDocument}
      >
        <FilePlusIcon />
      </Button>
      <UploadFileAction folderId={folderId} />
    </>
  );
}
