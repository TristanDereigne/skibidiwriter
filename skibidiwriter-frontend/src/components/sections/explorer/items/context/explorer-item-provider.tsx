import { useDisclosure } from "@/hooks/use-disclosure";
import { useEffect, useState } from "react";
import { ExplorerItemContext } from "./use-explorer-item";

interface Props {
  name: string;
  isJustCreated: boolean;
  children: React.ReactNode;
}

export default function ExplorerItemProvider({
  name,
  isJustCreated,
  children,
}: Readonly<Props>) {
  const [isRenaming, setIsRenaming] = useState(isJustCreated);
  const deleteDialog = useDisclosure();
  const shareDialog = useDisclosure();
  const infoDialog = useDisclosure();

  useEffect(() => {
    if (isJustCreated) setIsRenaming(true);
  }, [isJustCreated]);

  return (
    <ExplorerItemContext.Provider
      value={{
        name,
        isJustCreated,
        isRenaming,
        startRenaming: () => setIsRenaming(true),
        stopRenaming: () => setIsRenaming(false),
        deleteDialog,
        shareDialog,
        infoDialog,
      }}
    >
      {children}
    </ExplorerItemContext.Provider>
  );
}
