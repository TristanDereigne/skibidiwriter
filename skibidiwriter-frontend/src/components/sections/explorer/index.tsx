import SectionTabs from "@/components/sections/header/section-tabs";
import TrailBreadcrumb from "@/components/sections/header/trail-breadcrumb";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import AppHeader from "@/layout/app-header";
import ExplorerBackgroundMenu from "./content/explorer-background-menu";
import ExplorerContent from "./content/explorer-content";
import { useExplorer } from "./context/use-explorer";
import FileDropOverlay from "./drag/file-drop-overlay";
import { useFileDrop } from "./drag/use-file-drop";
import ExplorerHeaderActions from "./header/header-actions";

export default function Explorer() {
  const { createDocument, createFolder, path, folderId } = useExplorer();
  const { isDraggingFiles, dropProps } = useFileDrop(folderId);

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
          <SectionTabs />
        </div>
      </AppHeader>
      <div className="relative flex min-h-0 w-full flex-1 flex-col">
        <ContextMenu>
          <ContextMenuTrigger
            render={
              <main className="flex-1 overflow-auto p-6" {...dropProps} />
            }
          >
            <ExplorerContent />
          </ContextMenuTrigger>
          <ExplorerBackgroundMenu />
        </ContextMenu>
        <FileDropOverlay isActive={isDraggingFiles} />
      </div>
    </>
  );
}
