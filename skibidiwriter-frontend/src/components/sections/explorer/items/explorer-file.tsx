import {
  useDeleteFile,
  useDownloadFile,
  useRenameFile,
} from "@/hooks/use-files";
import { FILE_KIND_VIEW } from "@/components/shared/file-kind-view";
import { dateFormat } from "@/lib/format";
import { prefetchDocument } from "@/lib/document";
import { editPath } from "@/lib/paths";
import { useNavigate } from "react-router";
import type { FileDTO } from "skibidiwriter-shared";
import { useExplorer } from "../context/use-explorer";
import ExplorerItemProvider from "./context/explorer-item-provider";
import ExplorerDeleteDialog from "./dialogs/explorer-delete-dialog";
import ExplorerFileInfoDialog from "./dialogs/explorer-file-info-dialog";
import ExplorerShareDialog from "./dialogs/explorer-share-dialog";
import ExplorerItem from "./explorer-item";

interface Props {
  file: FileDTO;
}

export default function ExplorerFile({ file }: Readonly<Props>) {
  const { createdId } = useExplorer();
  const navigate = useNavigate();
  const renameFile = useRenameFile();
  const deleteFile = useDeleteFile();
  const downloadFile = useDownloadFile();

  const { icon, iconClassName, noun, nameLabel, typeLabel } =
    FILE_KIND_VIEW[file.kind];
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
        nameLabel={nameLabel}
        isShareable
        subtitle={[
          dateFormat.format(new Date(file.updatedAt)),
          file.lastModifiedBy?.name,
        ]
          .filter(Boolean)
          .join(" · ")}
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
      <ExplorerShareDialog fileId={file.id} />
      <ExplorerFileInfoDialog file={file} typeLabel={typeLabel} />
    </ExplorerItemProvider>
  );
}
