import ShareDialog from "@/components/sections/share/share-dialog";
import { useExplorerItem } from "../context/use-explorer-item";

interface Props {
  fileId: string;
}

export default function ExplorerShareDialog({ fileId }: Readonly<Props>) {
  const { name, shareDialog } = useExplorerItem();

  return <ShareDialog fileId={fileId} name={name} disclosure={shareDialog} />;
}
