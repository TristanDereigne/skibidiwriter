import {
  DEFAULT_DOCUMENT_NAME,
  useCreateDocument,
} from "@/hooks/use-documents";
import {
  DEFAULT_FOLDER_NAME,
  useCreateFolder,
  useFolderPath,
} from "@/hooks/use-folders";
import { useMemo, useState } from "react";
import { ExplorerContext, type ExplorerContextValue } from "./use-explorer";

interface Props {
  folderId: string | null;
  children: React.ReactNode;
}

export default function ExplorerProvider({
  folderId,
  children,
}: Readonly<Props>) {
  const createDocument = useCreateDocument();
  const createFolder = useCreateFolder();
  const { data: path } = useFolderPath(folderId);
  const [createdId, setCreatedId] = useState<string>();

  const value = useMemo<ExplorerContextValue>(
    () => ({
      folderId,
      path: folderId ? (path ?? []) : [],
      isNotFound: !!folderId && path === null,
      createdId,
      isCreatingDocument: createDocument.isPending,
      createDocument: () =>
        createDocument.mutate(
          { name: DEFAULT_DOCUMENT_NAME, folderId },
          { onSuccess: (document) => setCreatedId(document.id) },
        ),
      createFolder: () =>
        createFolder.mutate(
          { name: DEFAULT_FOLDER_NAME, parentId: folderId },
          { onSuccess: (folder) => setCreatedId(folder.id) },
        ),
    }),
    [folderId, path, createdId, createDocument, createFolder],
  );

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  );
}
