import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDocuments } from "@/hooks/use-documents";
import { FilePlusIcon } from "lucide-react";

interface Props {
  children: React.ReactNode;
  onCreate: () => void;
}

export default function ExplorerLayout({
  children,
  onCreate,
}: Readonly<Props>) {
  const { data } = useDocuments();

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-12 items-center gap-2 px-6">
        <h1 className="text-sm font-semibold">Documents</h1>
        {data && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {data.length}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          className="ml-auto text-muted-foreground"
          aria-label="New document"
          title="New document"
          onClick={onCreate}
        >
          <FilePlusIcon />
        </Button>
      </header>
      <Separator />
      <ContextMenu>
        <ContextMenuTrigger
          render={<main className="flex-1 overflow-auto p-6" />}
        >
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onCreate}>
            <FilePlusIcon />
            New document
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
