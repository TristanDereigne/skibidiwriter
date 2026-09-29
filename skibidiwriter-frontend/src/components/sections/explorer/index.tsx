import { useDocuments } from "@/hooks/use-documents";
import { useFolders } from "@/hooks/use-folders";
import ExplorerDocument from "./explorer-document";
import { useExplorer } from "./use-explorer";
import { ExplorerEmpty, ExplorerNotFound } from "./explorer-empty";
import ExplorerFolder from "./explorer-folder";
import ExplorerLayout from "./explorer-layout";
import ExplorerSkeleton from "./explorer-skeleton";

export default function Explorer() {
  return (
    <ExplorerLayout>
      <ExplorerContent />
    </ExplorerLayout>
  );
}

function ExplorerContent() {
  const { folderId, isNotFound } = useExplorer();
  const documents = useDocuments(folderId);
  const folders = useFolders(folderId);

  if (isNotFound)
    return (
      <Centered>
        <ExplorerNotFound />
      </Centered>
    );

  if (documents.isPending || folders.isPending) return <ExplorerSkeleton />;

  if (!documents.data?.length && !folders.data?.length) {
    return (
      <Centered>
        <ExplorerEmpty />
      </Centered>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-6">
      {folders.data?.map((folder) => (
        <ExplorerFolder key={folder.id} folder={folder} />
      ))}
      {documents.data?.map((document) => (
        <ExplorerDocument key={document.id} document={document} />
      ))}
    </div>
  );
}

function Centered({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {children}
    </div>
  );
}
