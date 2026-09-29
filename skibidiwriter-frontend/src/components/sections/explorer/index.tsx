import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { api } from "../../../lib/api";
import { ExplorerEmpty } from "./explorer-empty";
import ExplorerDocument from "./explorer-document";
import ExplorerSkeleton from "./explorer-skeleton";

const DOCUMENTS_QUERY_KEY = ["documents.list"];

function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await api.documents.$post({ json: { name } });
      if (!res.ok) throw new Error("Failed to create document");

      return await res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY }),
  });
}

const DEFAULT_NAME = "Untitled document";

export default function Explorer() {
  const createDocument = useCreateDocument();
  const { isPending, data } = useQuery({
    queryKey: DOCUMENTS_QUERY_KEY,
    queryFn: async () => {
      const res = await api.documents.$get();
      if (!res.ok) return null;

      return await res.json();
    },
  });

  const create = () => createDocument.mutate(DEFAULT_NAME);

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center justify-between px-8 py-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
          {data && (
            <p className="text-sm text-muted-foreground">
              {data.length} {data.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>
        <Button onClick={create} disabled={createDocument.isPending}>
          <PlusIcon />
          New document
        </Button>
      </header>
      <Separator />
      <main className="flex-1 overflow-auto p-8">
        {isPending ? (
          <ExplorerSkeleton />
        ) : data?.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-6">
            {data.map((document) => (
              <ExplorerDocument key={document.id} document={document} />
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ExplorerEmpty
              onCreate={create}
              isCreating={createDocument.isPending}
            />
          </div>
        )}
      </main>
    </div>
  );
}
