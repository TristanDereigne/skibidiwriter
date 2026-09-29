import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DEFAULT_DOCUMENT_NAME,
  useCreateDocument,
  useDocuments,
} from "@/hooks/use-documents";
import { PlusIcon } from "lucide-react";

export default function ExplorerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const createDocument = useCreateDocument();
  const { data } = useDocuments();

  const create = () => createDocument.mutate(DEFAULT_DOCUMENT_NAME);

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
