import AppHeader from "@/components/layout/app-header";
import TrailBreadcrumb from "@/components/layout/trail-breadcrumb";
import DocumentEditor from "@/components/sections/document/document-editor";
import { Badge } from "@/components/ui/badge";
import { useDocument } from "@/hooks/use-documents";
import { useFolderPath } from "@/hooks/use-folders";
import { CONNECTION_STATUS_LABELS, useConnectionStatus } from "@/lib/realtime";
import { useParams } from "react-router";

export const EditPage = () => {
  const { documentId } = useParams();
  const { isLoading, data: document } = useDocument(documentId);
  const { data: folders } = useFolderPath(document?.folderId ?? null);
  const status = useConnectionStatus();

  return (
    <div className="flex h-svh w-full flex-col">
      <AppHeader
        actions={
          <Badge variant={status === "connected" ? "secondary" : "outline"}>
            {CONNECTION_STATUS_LABELS[status]}
          </Badge>
        }
      >
        <TrailBreadcrumb
          folders={folders ?? []}
          current={isLoading ? "Loading…" : (document?.name ?? "Document")}
        />
      </AppHeader>
      <main className="mx-auto min-h-0 w-full max-w-3xl flex-1 px-6 py-8">
        {documentId && (
          <DocumentEditor key={documentId} documentId={documentId} />
        )}
      </main>
    </div>
  );
};
