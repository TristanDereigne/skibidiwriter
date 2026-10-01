import { FILE_KIND_VIEW } from "@/components/shared/file-kind-view";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDownloadFile } from "@/hooks/use-files";
import { prefetchDocument } from "@/lib/document";
import { dateFormat, formatBytes } from "@/lib/format";
import { editPath } from "@/lib/paths";
import { cn } from "cn";
import { useNavigate } from "react-router";
import type { SharedFileDTO } from "skibidiwriter-shared";
import SharedFileMenu from "./shared-file-menu";

interface Props {
  file: SharedFileDTO;
}

export default function SharedFileRow({ file }: Readonly<Props>) {
  const navigate = useNavigate();
  const downloadFile = useDownloadFile();

  const { icon: Icon, iconClassName } = FILE_KIND_VIEW[file.kind];
  const isDocument = file.kind === "document";
  const download = () => downloadFile.mutate(file.id);
  const open = isDocument ? () => navigate(editPath(file.id)) : download;

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <TableRow
            className="cursor-pointer"
            onClick={open}
            onPointerEnter={
              isDocument ? () => prefetchDocument(file.id) : undefined
            }
          />
        }
      >
        <TableCell className="max-w-0 pl-6 sm:max-w-none">
          <div className="flex items-center gap-3">
            <Icon
              strokeWidth={1.5}
              className={cn("size-6 shrink-0", iconClassName)}
            />
            <div className="min-w-0">
              <button
                type="button"
                className="block max-w-full truncate rounded text-left font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                title={file.name}
              >
                {file.name}
              </button>
              <p className="truncate text-xs text-muted-foreground sm:hidden">
                {file.owner.name}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>
                {file.owner.name.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{file.owner.name}</span>
          </div>
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">
          {dateFormat.format(new Date(file.sharedAt))}
        </TableCell>
        <TableCell className="hidden pr-6 text-right text-muted-foreground sm:table-cell">
          {formatBytes(file.sizeBytes)}
        </TableCell>
      </ContextMenuTrigger>
      <SharedFileMenu
        isDocument={isDocument}
        onOpen={open}
        onDownload={download}
      />
    </ContextMenu>
  );
}
