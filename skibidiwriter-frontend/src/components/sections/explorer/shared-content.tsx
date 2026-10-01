import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { UsersIcon } from "lucide-react";

export default function SharedContent() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UsersIcon />
          </EmptyMedia>
          <EmptyTitle>Aucun fichier partagé</EmptyTitle>
          <EmptyDescription>
            Les fichiers partagés avec vous apparaîtront ici
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
