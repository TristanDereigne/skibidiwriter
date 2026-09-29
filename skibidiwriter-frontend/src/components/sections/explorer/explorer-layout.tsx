import AppHeader from "@/components/layout/app-header";
import TrailBreadcrumb from "@/components/layout/trail-breadcrumb";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FilePlusIcon, FolderPlusIcon } from "lucide-react";
import { useExplorer } from "./use-explorer";

export default function ExplorerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { path, createDocument, createFolder } = useExplorer();

  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader
        actions={
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
          </>
        }
      >
        <TrailBreadcrumb folders={path} />
      </AppHeader>
      <ContextMenu>
        <ContextMenuTrigger
          render={<main className="flex-1 overflow-auto p-6" />}
        >
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={createDocument}>
            <FilePlusIcon />
            New document
          </ContextMenuItem>
          <ContextMenuItem onClick={createFolder}>
            <FolderPlusIcon />
            New folder
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
