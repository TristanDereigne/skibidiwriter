import {
  useDeleteDocument,
  useDownloadDocument,
  useRenameDocument,
} from "@/hooks/use-documents";
import { prefetchDocument } from "@/lib/document";
import { editPath } from "@/lib/paths";
import { FileTextIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { DocumentDTO } from "skibidiwriter-shared";
import { useExplorer } from "./use-explorer";
import ExplorerItem from "./explorer-item";

interface Props {
  document: DocumentDTO;
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function ExplorerDocument({ document }: Readonly<Props>) {
  const { createdId } = useExplorer();
  const navigate = useNavigate();
  const renameDocument = useRenameDocument();
  const deleteDocument = useDeleteDocument();
  const downloadDocument = useDownloadDocument();

  return (
    <ExplorerItem
      icon={FileTextIcon}
      iconClassName="fill-primary/15 text-primary"
      dragItem={{ kind: "document", id: document.id }}
      name={document.name}
      nameLabel="Document name"
      subtitle={dateFormat.format(new Date(document.updatedAt))}
      startRenaming={document.id === createdId}
      deleteDescription="This document will be permanently deleted. This can’t be undone."
      isDeleting={deleteDocument.isPending}
      onPrefetch={() => prefetchDocument(document.id)}
      onDownload={() =>
        downloadDocument.mutate({ id: document.id, name: document.name })
      }
      onOpen={() => navigate(editPath(document.id))}
      onRename={(name) => renameDocument.mutate({ id: document.id, name })}
      onDelete={() => deleteDocument.mutate(document.id)}
    />
  );
}
