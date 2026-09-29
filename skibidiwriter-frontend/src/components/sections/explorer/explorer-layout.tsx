import { api } from "@/lib/api";
import type { Button } from "@base-ui/react";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Separator } from "react-resizable-panels";

export default function ExplorerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const createDocument = useCreateDocument();
  const { data } = useQuery({
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
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
