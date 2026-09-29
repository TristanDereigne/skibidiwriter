import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { explorerPath } from "@/lib/paths";
import { Fragment } from "react";
import { Link } from "react-router";
import type { FolderDTO } from "skibidiwriter-shared";

interface Props {
  folders: FolderDTO[];
  current?: string;
}

export default function TrailBreadcrumb({ folders, current }: Readonly<Props>) {
  const trail = [
    { id: null, name: "Documents" },
    ...folders,
    ...(current === undefined ? [] : [{ id: "current", name: current }]),
  ];
  const last = trail.at(-1)!;

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap text-sm">
        {trail.slice(0, -1).map((crumb) => (
          <Fragment key={crumb.id ?? "root"}>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={explorerPath(crumb.id)} />}>
                {crumb.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="truncate font-semibold">
            {last.name}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
