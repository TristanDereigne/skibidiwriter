import Explorer from "@/components/sections/explorer";
import ExplorerProvider from "@/components/sections/explorer/context/explorer-provider";
import { useParams } from "react-router";

export const ExplorerPage = () => {
  const folderId = useParams().folderId ?? null;

  return (
    <ExplorerProvider key={folderId ?? "root"} folderId={folderId}>
      <Explorer />
    </ExplorerProvider>
  );
};
