import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import ExplorerDocument from "./explorer-document";
import { ExplorerEmpty } from "./explorer-empty";
import ExplorerLayout from "./explorer-layout";
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

  if (isPending) {
    return (
      <ExplorerLayout>
        <ExplorerSkeleton />
      </ExplorerLayout>
    );
  }

  return (
    <ExplorerLayout>
      {data?.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-6">
          {data.map((document) => (
            <ExplorerDocument key={document.id} document={document} />
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ExplorerEmpty
            onCreate={() => createDocument.mutate(DEFAULT_NAME)}
            isCreating={createDocument.isPending}
          />
        </div>
      )}
    </ExplorerLayout>
  );
}
