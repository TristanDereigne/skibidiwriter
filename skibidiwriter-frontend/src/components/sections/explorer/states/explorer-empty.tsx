import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderIcon, PlusIcon } from "lucide-react";
import { useExplorer } from "../context/use-explorer";

export default function ExplorerEmpty() {
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
