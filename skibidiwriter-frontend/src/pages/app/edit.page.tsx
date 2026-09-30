import TrailBreadcrumb from "@/components/sections/header/trail-breadcrumb.tsx";
import DocumentEditor from "@/components/sections/document/document-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { HeaderContext } from "@/context/HeaderContext";
import {
  useDocument,
  useDownloadDocument,
  useRenameDocument,
} from "@/hooks/use-documents";
import { useFolderPath } from "@/hooks/use-folders";
import { CONNECTION_STATUS_LABELS, useConnectionStatus } from "@/lib/realtime";
import { useContext, useEffect } from "react";
import { useParams } from "react-router";

export const EditPage = () => {
  const { documentId } = useParams();
  const { isLoading, data: document } = useDocument(documentId);
  const { data: folders } = useFolderPath(document?.folderId ?? null);
  const { mutate: rename } = useRenameDocument();
  const { mutate: download } = useDownloadDocument();
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
      <>
        <Badge variant={status === "connected" ? "secondary" : "outline"}>
          {CONNECTION_STATUS_LABELS[status]}
        </Badge>
        {documentRowId && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-2 text-muted-foreground"
            aria-label="Download document"
            title="Download document"
            onClick={() =>
              download({ id: documentRowId, name: documentName ?? "" })
            }
          >
            <DownloadIcon />
          </Button>
        )}
      </>,
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
    download,
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
