import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { explorerPath } from "@/lib/paths";
import { FolderIcon, FolderXIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { useExplorer } from "./use-explorer";

export function ExplorerEmpty() {
  const { createDocument, isCreatingDocument } = useExplorer();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No documents</EmptyTitle>
        <EmptyDescription>Create your first document</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={createDocument} disabled={isCreatingDocument}>
          <PlusIcon />
          New document
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function ExplorerNotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderXIcon />
        </EmptyMedia>
        <EmptyTitle>Folder not found</EmptyTitle>
        <EmptyDescription>
          This folder doesn’t exist or was deleted.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button nativeButton={false} render={<Link to={explorerPath(null)} />}>
          Back to documents
        </Button>
      </EmptyContent>
    </Empty>
  );
}
