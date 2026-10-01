import { useState, type DragEvent } from "react";
import { hasDragItem, readDragItem, type DragItem } from "./drag-item";

export function useItemDrop(onDropItem?: (item: DragItem) => void) {
  const [isDropActive, setIsDropActive] = useState(false);

  function canDrop(event: DragEvent) {
    return !!onDropItem && hasDragItem(event.dataTransfer);
  }

  const dropProps = {
    onDragOver: (event: DragEvent) => {
      if (!canDrop(event)) return;
      event.preventDefault();
      event.stopPropagation();
      setIsDropActive(true);
    },
    onDragLeave: () => setIsDropActive(false),
    onDrop: (event: DragEvent) => {
      setIsDropActive(false);
      if (!canDrop(event)) return;
      event.preventDefault();
      event.stopPropagation();

      const item = readDragItem(event.dataTransfer);
      if (item) onDropItem?.(item);
    },
  };

  return { isDropActive, dropProps };
}
