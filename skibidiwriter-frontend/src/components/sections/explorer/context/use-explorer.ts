import { createContext, useContext } from "react";
import type { FolderDTO } from "skibidiwriter-shared";

export interface ExplorerContextValue {
  folderId: string | null;
  path: FolderDTO[];
  isNotFound: boolean;
  createdId: string | undefined;
  isCreatingDocument: boolean;
  createDocument: () => void;
  createFolder: () => void;
}

export const ExplorerContext = createContext<ExplorerContextValue | null>(null);

export function useExplorer() {
  const context = useContext(ExplorerContext);
  if (!context) throw new Error("useExplorer must be used in ExplorerProvider");

  return context;
}
