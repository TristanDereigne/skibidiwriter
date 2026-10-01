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
import { Link } from "react-router";
import type { FolderDTO } from "skibidiwriter-shared";

interface Props {
  folders: FolderDTO[];
  current?: string;
  onRename?: (name: string) => void;
}

export default function TrailBreadcrumb({
  folders,
  current,
  onRename,
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
            <BreadcrumbItem className="shrink-0 whitespace-nowrap">
              <BreadcrumbLink render={<Link to={explorerPath(crumb.id)} />}>
                {crumb.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
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
                "truncate font-semibold",
                onRename && "cursor-text rounded px-1 hover:bg-muted",
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
