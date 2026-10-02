import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SearchXIcon } from "lucide-react";

export default function SharedNoResults() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>Aucun résultat</EmptyTitle>
        <EmptyDescription>
          Aucun fichier partagé ne correspond à votre recherche
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
