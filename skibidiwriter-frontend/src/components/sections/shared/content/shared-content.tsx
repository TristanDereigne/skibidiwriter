import { useSharedFiles } from "@/hooks/use-file-shares";
import SharedFileTable from "../list/shared-file-table";
import SharedEmpty from "../states/shared-empty";
import SharedError from "../states/shared-error";
import SharedSkeleton from "../states/shared-skeleton";

export default function SharedContent() {
  const { data: files, isPending, isError, error, refetch } = useSharedFiles();

  if (isPending) return <SharedSkeleton />;

  if (isError)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <SharedError message={error.message} onRetry={() => refetch()} />
      </div>
    );

  if (!files.length)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <SharedEmpty />
      </div>
    );

  return <SharedFileTable files={files} />;
}
