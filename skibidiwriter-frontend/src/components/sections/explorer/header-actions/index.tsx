import { Button } from "@/components/ui/button";
import { FilePlusIcon, FolderPlusIcon } from "lucide-react";
import UploadFileAction from "./upload-file-action";

export default function ExplorerHeaderActions({createFolder, createDocument, folderId}) {

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
