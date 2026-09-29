import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { FolderIcon, PlusIcon } from "lucide-react";

interface Props {
  onCreate: () => void;
  isCreating: boolean;
}

export function ExplorerEmpty({ onCreate, isCreating }: Props) {
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
        <Button onClick={onCreate} disabled={isCreating}>
          <PlusIcon />
          New document
        </Button>
      </EmptyContent>
    </Empty>
  );
}
