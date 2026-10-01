import { toast } from "@/components/ui/toast";
import {
  DEFAULT_DOCUMENT_NAME,
  useCreateDocument,
  useFiles,
} from "@/hooks/use-files";
import {
  DEFAULT_FOLDER_NAME,
  useCreateFolder,
  useFolderPath,
  useFolders,
} from "@/hooks/use-folders";
import { uniqueName } from "@/lib/names";
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
  const { data: files } = useFiles(folderId);
  const { data: folders } = useFolders(folderId);
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
          {
            name: uniqueName(
              DEFAULT_DOCUMENT_NAME,
              (files ?? []).map((file) => file.name),
            ),
            folderId,
          },
          {
            onSuccess: (document) => setCreatedId(document.id),
            onError: (error) =>
              toast.add({
                title: "Création impossible",
                description: error.message,
                type: "error",
              }),
          },
        ),
      createFolder: () =>
        createFolder.mutate(
          {
            name: uniqueName(
              DEFAULT_FOLDER_NAME,
              (folders ?? []).map((folder) => folder.name),
            ),
            parentId: folderId,
          },
          { onSuccess: (folder) => setCreatedId(folder.id) },
        ),
    }),
    [folderId, path, files, folders, createdId, createDocument, createFolder],
  );

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  );
}
