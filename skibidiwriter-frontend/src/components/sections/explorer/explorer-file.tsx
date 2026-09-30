import {
  useDeleteFile,
  useDownloadFile,
  useRenameFile,
} from "@/hooks/use-files";
import { FileIcon } from "lucide-react";
import type { FileDTO } from "skibidiwriter-shared";
import ExplorerItem from "./explorer-item";
import { dateFormat } from "@/lib/format";
import { useExplorer } from "./use-explorer";

interface Props {
  file: FileDTO;
}

export default function ExplorerFile({ file }: Readonly<Props>) {
  const { createdId } = useExplorer();
  const renameFile = useRenameFile();
  const deleteFile = useDeleteFile();
  const downloadFile = useDownloadFile();

  const download = () => downloadFile.mutate({ id: file.id, name: file.name });

  return (
    <ExplorerItem
      icon={FileIcon}
      iconClassName="fill-muted-foreground/10 text-muted-foreground"
      dragItem={{ kind: "file", id: file.id }}
      name={file.name}
      nameLabel="File name"
      subtitle={dateFormat.format(new Date(file.updatedAt))}
      startRenaming={file.id === createdId}
      deleteDescription="This file will be permanently deleted. This can’t be undone."
      isDeleting={deleteFile.isPending}
      onOpen={download}
      onDownload={download}
      onRename={(name) => renameFile.mutate({ id: file.id, name })}
      onDelete={() => deleteFile.mutate(file.id)}
    />
  );
}
