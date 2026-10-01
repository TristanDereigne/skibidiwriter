import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import InlineNameInput from "../../shared/inline-name-input.tsx";
import { explorerPath } from "@/lib/paths.ts";
import { cn } from "@/lib/utils.ts";
import { Fragment, useState } from "react";
import type { DragItem } from "../explorer/drag/drag-item.ts";
import { useItemDrop } from "../explorer/drag/use-item-drop.ts";
import { Link } from "react-router";
import type { FolderDTO } from "skibidiwriter-shared";

interface Props {
  folders: FolderDTO[];
  current?: string;
  onRename?: (name: string) => void;
  onDropItem?: (item: DragItem, folderId: string | null) => void;
}

interface CrumbProps {
  id: string | null;
  name: string;
  onDropItem?: (item: DragItem, folderId: string | null) => void;
}

function TrailCrumb({ id, name, onDropItem }: Readonly<CrumbProps>) {
  const { isDropActive, dropProps } = useItemDrop(
    onDropItem && ((item) => onDropItem(item, id)),
  );

  return (
    <BreadcrumbItem className="shrink-0 whitespace-nowrap">
      <BreadcrumbLink
        className={cn(
          "rounded px-1",
          isDropActive && "bg-primary/10 text-primary ring-1 ring-primary",
        )}
        render={<Link to={explorerPath(id)} />}
        {...dropProps}
      >
        {name}
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}

export default function TrailBreadcrumb({
  folders,
  current,
  onRename,
  onDropItem,
}: Readonly<Props>) {
  const [isRenaming, setIsRenaming] = useState(false);

  const trail = [
    { id: null, name: "Mon drive" },
    ...folders,
    ...(current === undefined ? [] : [{ id: "current", name: current }]),
  ];
  const last = trail.at(-1)!;

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap text-sm">
        {trail.slice(0, -1).map((crumb) => (
          <Fragment key={crumb.id ?? "root"}>
            <TrailCrumb
              id={crumb.id}
              name={crumb.name}
              onDropItem={onDropItem}
            />
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem className="min-w-0">
          {isRenaming && onRename ? (
            <InlineNameInput
              className="w-56"
              name={last.name}
              label="Nom du document"
              onCommit={onRename}
              onDone={() => setIsRenaming(false)}
            />
          ) : (
            <BreadcrumbPage
              className={cn(
                "truncate rounded px-1 font-semibold",
                onRename && "cursor-text hover:bg-muted",
              )}
              onClick={onRename && (() => setIsRenaming(true))}
              title={onRename && "Cliquer pour renommer"}
            >
              {last.name}
            </BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
