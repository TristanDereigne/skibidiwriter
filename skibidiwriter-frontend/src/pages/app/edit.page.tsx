import TrailBreadcrumb from "@/components/sections/header/trail-breadcrumb.tsx";
import DocumentChat from "@/components/sections/document/document-chat";
import DocumentEditor from "@/components/sections/document/document-editor";
import DocumentParticipants from "@/components/sections/document/document-participants";
import ShareDialog from "@/components/sections/share/share-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { DownloadIcon, MessageSquareIcon, UserPlusIcon } from "lucide-react";
import { useDownloadFile, useFile, useRenameFile } from "@/hooks/use-files";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useFolderPath } from "@/hooks/use-folders";
import { sharedPath } from "@/lib/paths";
import {
  CONNECTION_STATUS_LABELS,
  realtime,
  useConnectionStatus,
} from "@/lib/realtime";
import AppHeader from "@/layout/app-header.tsx";
import { cn } from "cn";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ServerEventType } from "skibidiwriter-shared";

export const EditPage = () => {
  const { documentId } = useParams();
  const { isLoading, data: document } = useFile(documentId);
  const { data: folders } = useFolderPath(document?.folderId ?? null);
  const { mutate: rename } = useRenameFile();
  const { mutate: download } = useDownloadFile();
  const status = useConnectionStatus();
  const navigate = useNavigate();
  const shareDialog = useDisclosure();
  const [isChatOpen, setIsChatOpen] = useState(
    () => globalThis.matchMedia("(min-width: 1024px)").matches,
  );
  const documentRowId = document?.id;
  const documentName = document?.name;

  useEffect(
    () =>
      realtime.onEvent((event) => {
        if (
          event.type !== ServerEventType.Document_Revoked ||
          event.documentId !== documentId
        )
          return;

        toast.add({
          title: "Accès retiré",
          description: "Ce document n'est plus partagé avec vous",
          type: "info",
        });
        navigate(sharedPath());
      }),
    [documentId, navigate],
  );

  return (
    <>
      <AppHeader
        actions={
          <>
            {documentId && <DocumentParticipants documentId={documentId} />}
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
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label="Afficher le chat"
              title="Afficher le chat"
              onClick={() => setIsChatOpen((isOpen) => !isOpen)}
            >
              <MessageSquareIcon />
            </Button>
            {document?.isOwner && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                aria-label="Partager le document"
                title="Partager le document"
                onClick={shareDialog.open}
              >
                <UserPlusIcon />
              </Button>
            )}
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
            documentRowId && document?.isOwner
              ? (name) => rename({ id: documentRowId, name })
              : undefined
          }
        />
      </AppHeader>
      {document?.isOwner && (
        <ShareDialog
          fileId={document.id}
          name={document.name}
          disclosure={shareDialog}
        />
      )}
      <div className="flex min-h-0 flex-1">
        <main className="min-h-0 flex-1 px-6 py-8">
          <div className="mx-auto size-full max-w-3xl">
            {documentId && (
              <DocumentEditor key={documentId} documentId={documentId} />
            )}
          </div>
        </main>
        {documentId && isChatOpen && (
          <DocumentChat
            key={documentId}
            documentId={documentId}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>
    </>
  );
};
