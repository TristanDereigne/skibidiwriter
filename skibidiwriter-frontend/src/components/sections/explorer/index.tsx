import { useDocuments } from "@/hooks/use-documents";
import { useFolders } from "@/hooks/use-folders";
import ExplorerDocument from "./explorer-document";
import { useExplorer } from "./use-explorer";
import { ExplorerEmpty, ExplorerNotFound } from "./explorer-empty";
import ExplorerFolder from "./explorer-folder";
import ExplorerSkeleton from "./explorer-skeleton";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FilePlusIcon, FolderPlusIcon } from "lucide-react";
import { useContext, useEffect } from "react";
import { HeaderContext } from "@/context/HeaderContext.tsx";
import TrailBreadcrumb from "@/components/layout/trail-breadcrumb";
import ExplorerHeaderActions from "@/components/sections/explorer/header-actions";

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

  return (
    <div className="flex h-full w-full flex-col">
      <ContextMenu>
        <ContextMenuTrigger
          render={<main className="flex-1 overflow-auto p-6" />}
        >
          <ExplorerContent />
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

function ExplorerContent() {
  const { folderId, isNotFound } = useExplorer();
  const documents = useDocuments(folderId);
  const folders = useFolders(folderId);

  if (isNotFound)
    return (
      <Centered>
        <ExplorerNotFound />
      </Centered>
    );

  if (documents.isPending || folders.isPending) return <ExplorerSkeleton />;

  if (!documents.data?.length && !folders.data?.length) {
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
      {documents.data?.map((document) => (
        <ExplorerDocument key={document.id} document={document} />
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
