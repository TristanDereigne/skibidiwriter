import {
  DEFAULT_DOCUMENT_NAME,
  useCreateDocument,
  useDocuments,
} from "@/hooks/use-documents";
import ExplorerDocument from "./explorer-document";
import { ExplorerEmpty } from "./explorer-empty";
import ExplorerLayout from "./explorer-layout";
import ExplorerSkeleton from "./explorer-skeleton";

export default function Explorer() {
  const createDocument = useCreateDocument();
  const { isPending, data } = useDocuments();

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
            onCreate={() => createDocument.mutate(DEFAULT_DOCUMENT_NAME)}
            isCreating={createDocument.isPending}
          />
        </div>
      )}
    </ExplorerLayout>
  );
}
