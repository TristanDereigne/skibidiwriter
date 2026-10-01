import { useExplorer } from "./context/use-explorer";
import ExplorerContent from "./content/explorer-content";
import SharedContent from "./content/shared-content";

import ExplorerHeaderActions from "./header/header-actions";
import AppHeader from "@/layout/app-header.tsx";
import TrailBreadcrumb from "@/components/sections/header/trail-breadcrumb.tsx";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "cn";
import { FilePlusIcon, FolderPlusIcon, UploadCloudIcon } from "lucide-react";
import { useState } from "react";
import { hasDragItem } from "./drag/drag-item";
import { useSearchParams } from "react-router";
import ExplorerHeaderTabs from "./header/explorer-header-tabs";
import {
  parseExplorerHeaderTab,
  type ExplorerHeaderTab,
} from "./header/explorer-tab";
import { useUploadFiles } from "./use-upload-files";

export default function Explorer() {
  const { createDocument, createFolder, path, folderId } = useExplorer();
  const uploadFiles = useUploadFiles(folderId);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = parseExplorerHeaderTab(searchParams.get("tab"));

  function changeTab(next: ExplorerHeaderTab) {
    setSearchParams(next === "self" ? {} : { tab: next });
  }

  function isFileDrag(event: React.DragEvent) {
    return (
      event.dataTransfer.types.includes("Files") &&
      !hasDragItem(event.dataTransfer)
    );
  }

  return (
    <>
      <AppHeader
        actions={
          <ExplorerHeaderActions
            createDocument={createDocument}
            createFolder={createFolder}
            folderId={folderId}
          />
        }
      >
        <div className="flex items-center gap-5">
          <TrailBreadcrumb folders={path} />
          <ExplorerHeaderTabs value={tab} onValueChange={changeTab} />
        </div>
      </AppHeader>
      <div className="relative flex min-h-0 w-full flex-1 flex-col">
        <ContextMenu>
          <ContextMenuTrigger
            render={
              <main
                className="flex-1 overflow-auto p-6"
                onDragOver={(event: React.DragEvent) => {
                  if (!isFileDrag(event)) return;
                  event.preventDefault();
                  setIsDraggingFiles(true);
                }}
                onDragLeave={(event: React.DragEvent) => {
                  if (
                    event.currentTarget.contains(event.relatedTarget as Node)
                  ) {
                    return;
                  }
                  setIsDraggingFiles(false);
                }}
                onDrop={(event: React.DragEvent) => {
                  setIsDraggingFiles(false);
                  if (!isFileDrag(event)) return;
                  event.preventDefault();
                  uploadFiles(Array.from(event.dataTransfer.files));
                }}
              />
            }
          >
            {tab === "self" ? <ExplorerContent /> : <SharedContent />}
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
          aria-hidden={!isDraggingFiles}
          className={cn(
            "pointer-events-none absolute inset-3 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-background/80 text-primary opacity-0 backdrop-blur-sm transition-opacity duration-150",
            isDraggingFiles && "opacity-100",
          )}
        >
          <UploadCloudIcon className="size-10" />
          <p className="text-sm font-medium">
            Déposez des fichiers pour les téléverser
          </p>
        </div>
      </div>
    </>
  );
}
