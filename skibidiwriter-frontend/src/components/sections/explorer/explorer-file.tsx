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
import { dateFormat } from "@/lib/format";
import { useExplorer } from "./use-explorer";

const KIND_VIEW = {
  document: {
    icon: FileTextIcon,
    iconClassName: "fill-primary/15 text-primary",
    noun: "document",
  },
  upload: {
    icon: FileIcon,
    iconClassName: "fill-muted-foreground/10 text-muted-foreground",
    noun: "file",
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

  const { icon, iconClassName, noun } = KIND_VIEW[file.kind];
  const isDocument = file.kind === "document";
  const download = () => downloadFile.mutate(file.id);

  return (
    <ExplorerItem
      icon={icon}
      iconClassName={iconClassName}
      dragItem={{ kind: "file", id: file.id }}
      name={file.name}
      nameLabel={`${noun[0]!.toUpperCase()}${noun.slice(1)} name`}
      subtitle={dateFormat.format(new Date(file.updatedAt))}
      startRenaming={file.id === createdId}
      deleteDescription={`This ${noun} will be permanently deleted. This can’t be undone.`}
      isDeleting={deleteFile.isPending}
      onPrefetch={isDocument ? () => prefetchDocument(file.id) : undefined}
      onOpen={isDocument ? () => navigate(editPath(file.id)) : download}
      onDownload={download}
      onRename={(name) => renameFile.mutate({ id: file.id, name })}
      onDelete={() => deleteFile.mutate(file.id)}
    />
  );
}
