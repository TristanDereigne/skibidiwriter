import TrailBreadcrumb from "@/components/sections/header/trail-breadcrumb.tsx";
import DocumentEditor from "@/components/sections/document/document-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useDownloadFile, useFile, useRenameFile } from "@/hooks/use-files";
import { useFolderPath } from "@/hooks/use-folders";
import { CONNECTION_STATUS_LABELS, useConnectionStatus } from "@/lib/realtime";
import AppHeader from "@/layout/app-header.tsx";
import { cn } from "cn";
import { useParams } from "react-router";

export const EditPage = () => {
  const { documentId } = useParams();
  const { isLoading, data: document } = useFile(documentId);
  const { data: folders } = useFolderPath(document?.folderId ?? null);
  const { mutate: rename } = useRenameFile();
  const { mutate: download } = useDownloadFile();
  const status = useConnectionStatus();
  const documentRowId = document?.id;
  const documentName = document?.name;

  return (
    <>
      <AppHeader
        actions={
          <>
            <Badge variant={status === "connected" ? "secondary" : "outline"}>
              <span
                className={cn(
                  "size-2 rounded-full sm:hidden",
                  status === "connected" ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
              <span className="max-sm:sr-only">
                {CONNECTION_STATUS_LABELS[status]}
              </span>
            </Badge>
            {documentRowId && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="ml-2 text-muted-foreground"
                aria-label="Télécharger le document"
                title="Télécharger le document"
                onClick={() => download(documentRowId)}
              >
                <DownloadIcon />
              </Button>
            )}
          </>
        }
      >
        <TrailBreadcrumb
          folders={folders ?? []}
          current={isLoading ? "Chargement…" : (documentName ?? "Document")}
          onRename={
            documentRowId
              ? (name) => rename({ id: documentRowId, name })
              : undefined
          }
        />
      </AppHeader>
      <main className="mx-auto min-h-0 w-full max-w-3xl flex-1 px-6 py-8">
        {documentId && (
          <DocumentEditor key={documentId} documentId={documentId} />
        )}
      </main>
    </>
  );
};
