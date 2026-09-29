import {
  DEFAULT_DOCUMENT_NAME,
  useCreateDocument,
  useDocuments,
} from "@/hooks/use-documents";
import { useState } from "react";
import ExplorerDocument from "./explorer-document";
import { ExplorerEmpty } from "./explorer-empty";
import ExplorerLayout from "./explorer-layout";
import ExplorerSkeleton from "./explorer-skeleton";

export default function Explorer() {
  const createDocument = useCreateDocument();
  const { isPending, data } = useDocuments();
  const [createdId, setCreatedId] = useState<string>();

  const create = () =>
    createDocument.mutate(DEFAULT_DOCUMENT_NAME, {
      onSuccess: (document) => setCreatedId(document.id),
    });

  if (isPending) {
    return (
      <ExplorerLayout onCreate={create}>
        <ExplorerSkeleton />
      </ExplorerLayout>
    );
  }

  return (
    <ExplorerLayout onCreate={create}>
      {data?.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-6">
          {data.map((document) => (
            <ExplorerDocument
              key={document.id}
              document={document}
              startRenaming={document.id === createdId}
            />
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
    </ExplorerLayout>
  );
}
