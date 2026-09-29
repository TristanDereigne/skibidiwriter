import DocumentEditor from "@/components/sections/document/document-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDocument } from "@/hooks/use-documents";
import { explorerPath } from "@/lib/paths";
import { CONNECTION_STATUS_LABELS, useConnectionStatus } from "@/lib/realtime";
import { ArrowLeftIcon, LoaderCircleIcon } from "lucide-react";
import { Link, useParams } from "react-router";

export const EditPage = () => {
  const { documentId } = useParams();
  const { isLoading, data: document } = useDocument(documentId);
  const status = useConnectionStatus();

  const name = document?.name;

  return (
    <div className="flex h-full min-h-screen w-full flex-col">
      <header className="flex items-center gap-3 px-6 py-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Back to documents"
          nativeButton={false}
          render={<Link to={explorerPath(document?.folderId ?? null)} />}
        >
          <ArrowLeftIcon />
        </Button>
        <h1 className="flex-1 truncate text-lg font-semibold tracking-tight">
          {isLoading ? (
            <div className="flex text-muted-foreground shimmer gap-1 items-center">
              <span>Loading</span>
              <LoaderCircleIcon className="animate-spin size-4" />
            </div>
          ) : (
            (name ?? "Document")
          )}
        </h1>
        <Badge variant={status === "connected" ? "secondary" : "outline"}>
          {CONNECTION_STATUS_LABELS[status]}
        </Badge>
      </header>
      <Separator />
      <main className="mx-auto min-h-0 w-full max-w-3xl flex-1 px-6 py-8">
        {documentId && (
          <DocumentEditor key={documentId} documentId={documentId} />
        )}
      </main>
    </div>
  );
};
