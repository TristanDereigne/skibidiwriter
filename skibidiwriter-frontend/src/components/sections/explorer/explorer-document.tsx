import { FileTextIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { DocumentDTO } from "skibidiwriter-shared";

interface Props {
  document: DocumentDTO;
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function ExplorerDocument({ document }: Readonly<Props>) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="group flex flex-col items-center gap-2 rounded-xl p-2 text-center outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      onClick={() => navigate(`/edit/${document.id}`)}
    >
      <div className="flex aspect-3/4 w-full items-center justify-center rounded-lg border bg-card shadow-sm transition-shadow group-hover:shadow-md">
        <FileTextIcon className="size-10 text-muted-foreground" />
      </div>
      <div className="w-full">
        <p className="truncate text-sm font-medium">{document.name}</p>
        <p className="text-xs text-muted-foreground">
          {dateFormat.format(new Date(document.updatedAt))}
        </p>
      </div>
    </button>
  );
}
