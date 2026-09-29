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
import { useExplorer } from "./use-explorer";

export default function ExplorerBreadcrumb() {
  const { path } = useExplorer();

  const crumbs = [{ id: null, name: "Documents" }, ...path];
  const current = crumbs[crumbs.length - 1]!;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm">
        {crumbs.slice(0, -1).map((crumb) => (
          <Fragment key={crumb.id ?? "root"}>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={explorerPath(crumb.id)} />}>
                {crumb.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold">
            {current.name}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
