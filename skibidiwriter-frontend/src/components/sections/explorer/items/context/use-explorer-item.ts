import type { Disclosure } from "@/hooks/use-disclosure";
import { createContext, useContext } from "react";

interface ExplorerItemContextValue {
  name: string;
  isJustCreated: boolean;
  isRenaming: boolean;
  startRenaming: () => void;
  stopRenaming: () => void;
  deleteDialog: Disclosure;
  shareDialog: Disclosure;
  infoDialog: Disclosure;
}

export const ExplorerItemContext =
  createContext<ExplorerItemContextValue | null>(null);

export function useExplorerItem() {
  const context = useContext(ExplorerItemContext);
  if (!context)
    throw new Error("useExplorerItem must be used in ExplorerItemProvider");

  return context;
}
