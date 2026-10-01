import { useState, type DragEvent } from "react";
import { useUploadFiles } from "../use-upload-files";
import { hasDragItem } from "./drag-item";

function isFileDrag(event: DragEvent) {
  return (
    event.dataTransfer.types.includes("Files") &&
    !hasDragItem(event.dataTransfer)
  );
}

export function useFileDrop(folderId: string | null) {
  const uploadFiles = useUploadFiles(folderId);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);

  const dropProps = {
    onDragOver: (event: DragEvent) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      setIsDraggingFiles(true);
    },
    onDragLeave: (event: DragEvent) => {
      if (event.currentTarget.contains(event.relatedTarget as Node)) return;
      setIsDraggingFiles(false);
    },
    onDrop: (event: DragEvent) => {
      setIsDraggingFiles(false);
      if (!isFileDrag(event)) return;
      event.preventDefault();
      uploadFiles(Array.from(event.dataTransfer.files));
    },
  };

  return { isDraggingFiles, dropProps };
}
