import AppHeader from "@/components/layout/app-header";
import TrailBreadcrumb from "@/components/layout/trail-breadcrumb";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FilePlusIcon, FolderPlusIcon } from "lucide-react";
import ExplorerHeaderActions from "./explorer-header-actions";
import { useExplorer } from "./use-explorer";

export default function ExplorerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { path, createDocument, createFolder } = useExplorer();

  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader actions={<ExplorerHeaderActions />}>
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
