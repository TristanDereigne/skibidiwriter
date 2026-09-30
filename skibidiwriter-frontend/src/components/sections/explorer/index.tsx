import { useFiles } from "@/hooks/use-files";
import { useFolders } from "@/hooks/use-folders";
import { ExplorerEmpty, ExplorerNotFound } from "./explorer-empty";
import ExplorerFile from "./explorer-file";
import ExplorerFolder from "./explorer-folder";
import ExplorerSkeleton from "./explorer-skeleton";
import { useExplorer } from "./use-explorer";

import ExplorerHeaderActions from "@/components/sections/explorer/header-actions";
import TrailBreadcrumb from "@/components/sections/header/trail-breadcrumb.tsx";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { HeaderContext } from "@/context/HeaderContext.tsx";
import { cn } from "cn";
import { FilePlusIcon, FolderPlusIcon, UploadCloudIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { hasDragItem } from "./drag-item";
import { useUploadFiles } from "./use-upload-files";

export default function Explorer() {
  const { createDocument, createFolder, path, folderId } = useExplorer();
  const headerContext = useContext(HeaderContext);
  const setHeaderChildren = headerContext?.setHeaderChildren;
  const setHeaderActions = headerContext?.setHeaderActions;

  useEffect(() => {
    setHeaderChildren?.(<TrailBreadcrumb folders={path} />);
    setHeaderActions?.(
      <ExplorerHeaderActions
        createDocument={createDocument}
        createFolder={createFolder}
        folderId={folderId}
      />,
    );

    return () => {
      setHeaderChildren?.(null);
      setHeaderActions?.(null);
    };
  }, [
    setHeaderChildren,
    setHeaderActions,
    path,
    createDocument,
    createFolder,
    folderId,
  ]);

  const uploadFiles = useUploadFiles(folderId);
  const [draggingFiles, setDraggingFiles] = useState(false);

  function isFileDrag(event: React.DragEvent) {
    return (
      event.dataTransfer.types.includes("Files") &&
      !hasDragItem(event.dataTransfer)
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      <ContextMenu>
        <ContextMenuTrigger
          render={
            <main
              className="flex-1 overflow-auto p-6"
              onDragOver={(event: React.DragEvent) => {
                if (!isFileDrag(event)) return;
                event.preventDefault();
                setDraggingFiles(true);
              }}
              onDragLeave={(event: React.DragEvent) => {
                if (event.currentTarget.contains(event.relatedTarget as Node)) {
                  return;
                }
                setDraggingFiles(false);
              }}
              onDrop={(event: React.DragEvent) => {
                setDraggingFiles(false);
                if (!isFileDrag(event)) return;
                event.preventDefault();
                uploadFiles(Array.from(event.dataTransfer.files));
              }}
            />
          }
        >
          <ExplorerContent />
        </ContextMenuTrigger>
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
      </ContextMenu>
      <div
        aria-hidden={!draggingFiles}
        className={cn(
          "pointer-events-none absolute inset-3 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-background/80 text-primary opacity-0 backdrop-blur-sm transition-opacity duration-150",
          draggingFiles && "opacity-100",
        )}
      >
        <UploadCloudIcon className="size-10" />
        <p className="text-sm font-medium">
          Déposez des fichiers pour les téléverser
        </p>
      </div>
    </div>
  );
}

function ExplorerContent() {
  const { folderId, isNotFound } = useExplorer();
  const folders = useFolders(folderId);
  const files = useFiles(folderId);

  if (isNotFound)
    return (
      <Centered>
        <ExplorerNotFound />
      </Centered>
    );

  if (folders.isPending || files.isPending) return <ExplorerSkeleton />;

  if (!folders.data?.length && !files.data?.length) {
    return (
      <Centered>
        <ExplorerEmpty />
      </Centered>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-6">
      {folders.data?.map((folder) => (
        <ExplorerFolder key={folder.id} folder={folder} />
      ))}
      {files.data?.map((file) => (
        <ExplorerFile key={file.id} file={file} />
      ))}
    </div>
  );
}

function Centered({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {children}
    </div>
  );
}
