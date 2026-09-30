import TrailBreadcrumb from "@/components/sections/header/trail-breadcrumb.tsx";
import DocumentEditor from "@/components/sections/document/document-editor";
import { Badge } from "@/components/ui/badge";
import { HeaderContext } from "@/context/HeaderContext";
import { useDocument, useRenameDocument } from "@/hooks/use-documents";
import { useFolderPath } from "@/hooks/use-folders";
import { CONNECTION_STATUS_LABELS, useConnectionStatus } from "@/lib/realtime";
import { useContext, useEffect } from "react";
import { useParams } from "react-router";

export const EditPage = () => {
  const { documentId } = useParams();
  const { isLoading, data: document } = useDocument(documentId);
  const { data: folders } = useFolderPath(document?.folderId ?? null);
  const { mutate: rename } = useRenameDocument();
  const status = useConnectionStatus();
  const headerContext = useContext(HeaderContext);
  const setHeaderChildren = headerContext?.setHeaderChildren;
  const setHeaderActions = headerContext?.setHeaderActions;

  const documentRowId = document?.id;
  const documentName = document?.name;

  useEffect(() => {
    setHeaderChildren?.(
      <TrailBreadcrumb
        folders={folders ?? []}
        current={isLoading ? "Loading…" : (documentName ?? "Document")}
        onRename={
          documentRowId
            ? (name) => rename({ id: documentRowId, name })
            : undefined
        }
      />,
    );
    setHeaderActions?.(
      <Badge variant={status === "connected" ? "secondary" : "outline"}>
        {CONNECTION_STATUS_LABELS[status]}
      </Badge>,
    );

    return () => {
      setHeaderChildren?.(null);
      setHeaderActions?.(null);
    };
  }, [
    setHeaderChildren,
    setHeaderActions,
    folders,
    isLoading,
    documentName,
    documentRowId,
    rename,
    status,
  ]);

  return (
    <main className="mx-auto min-h-0 w-full max-w-3xl flex-1 px-6 py-8">
      {documentId && (
        <DocumentEditor key={documentId} documentId={documentId} />
      )}
    </main>
  );
};
