import { toast } from "@/components/ui/toast";
import { useMoveFile } from "@/hooks/use-files";
import { useMoveFolder } from "@/hooks/use-folders";
import type { DragItem } from "./drag-item";

export function useMoveItem() {
  const moveFile = useMoveFile();
  const moveFolder = useMoveFolder();

  return (item: DragItem, targetFolderId: string | null) => {
    const onError = (error: Error) =>
      toast.add({
        title: "Déplacement impossible",
        description: error.message,
        type: "error",
      });

    if (item.kind === "file") {
      moveFile.mutate({ id: item.id, folderId: targetFolderId }, { onError });
    } else if (item.id !== targetFolderId) {
      moveFolder.mutate({ id: item.id, parentId: targetFolderId }, { onError });
    }
  };
}
