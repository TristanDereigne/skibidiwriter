import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Separator } from "@/components/ui/separator";
import { FilePlusIcon, FolderPlusIcon } from "lucide-react";
import ExplorerBreadcrumb from "./explorer-breadcrumb";
import { useExplorer } from "./use-explorer";

export default function ExplorerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { createDocument, createFolder } = useExplorer();

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-12 items-center gap-2 px-6">
        <ExplorerBreadcrumb />
        <div className="ml-auto flex items-center">
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
        </div>
      </header>
      <Separator />
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
