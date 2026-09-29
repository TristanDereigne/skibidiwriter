import { useQuery } from "@tanstack/react-query";
import { FolderIcon } from "lucide-react";
import type { DocumentDTO } from "skibidiwriter-shared";
import { Button } from "./components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./components/ui/empty";
import { api } from "./lib/api";

export default function Explorer() {
  const { isPending, data } = useQuery({
    queryKey: ["documents.list"],
    queryFn: async () => {
      const res = await api.documents.$get();
      if (!res.ok) return null;

      return await res.json();
    },
  });

  return (
    <div className="flex w-full h-full">
      Explorer
      {data?.length ? (
        <div className="grid grid-cols-5 gap-5">
          {data?.map((document) => (
            <Document key={document.id} document={document} />
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ExplorerEmpty />
        </div>
      )}
    </div>
  );
}

function ExplorerEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No documents</EmptyTitle>
        <EmptyDescription>No documents found</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create document</Button>
      </EmptyContent>
    </Empty>
  );
}

function Document({ document }: { readonly document: DocumentDTO }) {
  return <div>{document.name}</div>;
}
