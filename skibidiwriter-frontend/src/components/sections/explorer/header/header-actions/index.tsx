import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FilePlusIcon,
  FolderPlusIcon,
  PlusIcon,
  UploadIcon,
} from "lucide-react";
import { useRef } from "react";
import UploadFileInput from "./upload-file-input";

interface Props {
  createFolder: () => void;
  createDocument: () => void;
  folderId: string | null;
}

export default function ExplorerHeaderActions({
  createFolder,
  createDocument,
  folderId,
}: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <UploadFileInput ref={inputRef} folderId={folderId} />
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="sm" aria-label="Nouveau" />}>
          <PlusIcon />
          <span className="max-sm:hidden">Nouveau</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-52">
          <DropdownMenuItem onClick={createFolder}>
            <FolderPlusIcon />
            Nouveau dossier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={createDocument}>
            <FilePlusIcon />
            Nouveau document
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => inputRef.current?.click()}>
            <UploadIcon />
            Téléverser des fichiers
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
