import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSharedFiles } from "@/hooks/use-file-shares";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import SharedFileTable from "../list/shared-file-table";
import SharedEmpty from "../states/shared-empty";
import SharedError from "../states/shared-error";
import SharedNoResults from "../states/shared-no-results";
import SharedSkeleton from "../states/shared-skeleton";

export default function SharedContent() {
  const { data: files, isPending, isError, error, refetch } = useSharedFiles();
  const [query, setQuery] = useState("");

  if (isPending) return <SharedSkeleton />;

  if (isError)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <SharedError message={error.message} onRetry={() => refetch()} />
      </div>
    );

  if (!files.length)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <SharedEmpty />
      </div>
    );

  const term = query.trim().toLowerCase();
  const matches = files.filter(({ name, owner }) =>
    `${name} ${owner.name}`.toLowerCase().includes(term),
  );

  return (
    <>
      <div className="px-6 py-4">
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un fichier ou une personne…"
            aria-label="Rechercher"
          />
        </InputGroup>
      </div>
      {matches.length ? (
        <SharedFileTable files={matches} />
      ) : (
        <div className="flex justify-center py-16">
          <SharedNoResults />
        </div>
      )}
    </>
  );
}
