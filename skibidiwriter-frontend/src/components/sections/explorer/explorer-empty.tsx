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
        <EmptyTitle>Aucun document</EmptyTitle>
        <EmptyDescription>Créez votre premier document</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={createDocument} disabled={isCreatingDocument}>
          <PlusIcon />
          Nouveau document
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
        <EmptyTitle>Dossier introuvable</EmptyTitle>
        <EmptyDescription>
          Ce dossier n’existe pas ou a été supprimé.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button nativeButton={false} render={<Link to={explorerPath(null)} />}>
          Retour aux documents
        </Button>
      </EmptyContent>
    </Empty>
  );
}
