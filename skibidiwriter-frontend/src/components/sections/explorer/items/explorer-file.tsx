import {
  useDeleteFile,
  useDownloadFile,
  useRenameFile,
} from "@/hooks/use-files";
import { dateFormat } from "@/lib/format";
import { prefetchDocument } from "@/lib/document";
import { editPath } from "@/lib/paths";
import { FileIcon, FileTextIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { FileDTO } from "skibidiwriter-shared";
import { useExplorer } from "../context/use-explorer";
import ExplorerItemProvider from "./context/explorer-item-provider";
import ExplorerDeleteDialog from "./dialogs/explorer-delete-dialog";
import ExplorerFileInfoDialog from "./dialogs/explorer-file-info-dialog";
import ExplorerShareDialog from "./dialogs/explorer-share-dialog";
import ExplorerItem from "./explorer-item";

const KIND_VIEW = {
  document: {
    icon: FileTextIcon,
    iconClassName: "fill-primary/15 text-primary",
    noun: "document",
    typeLabel: "Document",
    label: "Nom du document",
  },
  upload: {
    icon: FileIcon,
    iconClassName: "fill-muted-foreground/10 text-muted-foreground",
    noun: "fichier",
    typeLabel: "Fichier",
    label: "Nom du fichier",
  },
} as const;

interface Props {
  file: FileDTO;
}

export default function ExplorerFile({ file }: Readonly<Props>) {
  const { createdId } = useExplorer();
  const navigate = useNavigate();
  const renameFile = useRenameFile();
  const deleteFile = useDeleteFile();
  const downloadFile = useDownloadFile();

  const { icon, iconClassName, noun, label, typeLabel } = KIND_VIEW[file.kind];
  const isDocument = file.kind === "document";
  const download = () => downloadFile.mutate(file.id);

  return (
    <ExplorerItemProvider
      name={file.name}
      isJustCreated={file.id === createdId}
    >
      <ExplorerItem
        icon={icon}
        iconClassName={iconClassName}
        dragItem={{ kind: "file", id: file.id }}
        nameLabel={label}
        isShareable
        subtitle={dateFormat.format(new Date(file.updatedAt))}
        onPrefetch={isDocument ? () => prefetchDocument(file.id) : undefined}
        onOpen={isDocument ? () => navigate(editPath(file.id)) : download}
        onDownload={download}
        onRename={(name) => renameFile.mutate({ id: file.id, name })}
      />

      <ExplorerDeleteDialog
        description={`Ce ${noun} sera supprimé définitivement. Cette action est irréversible.`}
        isPending={deleteFile.isPending}
        onConfirm={() => deleteFile.mutate(file.id)}
      />
      <ExplorerShareDialog />
      <ExplorerFileInfoDialog file={file} typeLabel={typeLabel} />
    </ExplorerItemProvider>
  );
}
