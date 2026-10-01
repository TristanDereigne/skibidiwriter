import { useFiles } from "@/hooks/use-files";
import { useFolders } from "@/hooks/use-folders";
import { useExplorer } from "../context/use-explorer";
import ExplorerFile from "../items/explorer-file";
import ExplorerFolder from "../items/explorer-folder";
import ExplorerEmpty from "../states/explorer-empty";
import ExplorerNotFound from "../states/explorer-not-found";
import ExplorerSkeleton from "../states/explorer-skeleton";

export default function ExplorerContent() {
  const { folderId, isNotFound } = useExplorer();
  const folders = useFolders(folderId);
  const files = useFiles(folderId);

  if (isNotFound)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ExplorerNotFound />
      </div>
    );

  if (folders.isPending || files.isPending) return <ExplorerSkeleton />;

  if (!folders.data?.length && !files.data?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ExplorerEmpty />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-6">
      {folders.data?.map((folder) => (
        <ExplorerFolder key={folder.id} folder={folder} />
      ))}
      {files.data?.map((file) => (
        <ExplorerFile key={file.id} file={file} />
      ))}
    </div>
  );
}
