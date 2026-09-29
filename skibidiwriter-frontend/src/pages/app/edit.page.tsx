import DocEditor from "@/DocEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDocuments } from "@/hooks/use-documents";
import { CONNECTION_STATUS_LABELS, useConnectionStatus } from "@/lib/realtime";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router";

export const EditPage = () => {
  const { id } = useParams();
  const { data } = useDocuments();
  const status = useConnectionStatus();

  const name = data?.find((document) => document.id === id)?.name;

  return (
    <div className="flex h-full min-h-screen w-full flex-col">
      <header className="flex items-center gap-3 px-6 py-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Back to documents"
          render={<Link to="/explorer" />}
        >
          <ArrowLeftIcon />
        </Button>
        <h1 className="flex-1 truncate text-lg font-semibold tracking-tight">
          {name ?? "Document"}
        </h1>
        <Badge variant={status === "connected" ? "secondary" : "outline"}>
          {CONNECTION_STATUS_LABELS[status]}
        </Badge>
      </header>
      <Separator />
      <main className="mx-auto min-h-0 w-full max-w-3xl flex-1 px-6 py-8">
        <DocEditor />
      </main>
    </div>
  );
};
