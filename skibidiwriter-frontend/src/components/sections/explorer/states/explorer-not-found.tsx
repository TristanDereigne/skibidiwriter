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
import { FolderXIcon } from "lucide-react";
import { Link } from "react-router";

export default function ExplorerNotFound() {
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
