import {
  useDeleteFile,
  useDownloadFile,
  useRenameFile,
} from "@/hooks/use-files";
import { prefetchDocument } from "@/lib/document";
import { editPath } from "@/lib/paths";
import { FileIcon, FileTextIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { FileDTO } from "skibidiwriter-shared";
import ExplorerItem from "./explorer-item";
import { dateFormat, dateTimeFormat, formatBytes } from "@/lib/format";
import { useExplorer } from "../context/use-explorer";

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
    <ExplorerItem
      icon={icon}
      iconClassName={iconClassName}
      dragItem={{ kind: "file", id: file.id }}
      name={file.name}
      nameLabel={label}
      subtitle={dateFormat.format(new Date(file.updatedAt))}
      infoRows={[
        { label: "Type", value: typeLabel },
        { label: "Format", value: file.mimeType },
        { label: "Taille", value: formatBytes(file.sizeBytes) },
        {
          label: "Créé le",
          value: dateTimeFormat.format(new Date(file.createdAt)),
        },
        {
          label: "Modifié le",
          value: dateTimeFormat.format(new Date(file.updatedAt)),
        },
      ]}
      startRenaming={file.id === createdId}
      deleteDescription={`Ce ${noun} sera supprimé définitivement. Cette action est irréversible.`}
      isDeleting={deleteFile.isPending}
      onPrefetch={isDocument ? () => prefetchDocument(file.id) : undefined}
      onOpen={isDocument ? () => navigate(editPath(file.id)) : download}
      onDownload={download}
      onRename={(name) => renameFile.mutate({ id: file.id, name })}
      onDelete={() => deleteFile.mutate(file.id)}
    />
  );
}
