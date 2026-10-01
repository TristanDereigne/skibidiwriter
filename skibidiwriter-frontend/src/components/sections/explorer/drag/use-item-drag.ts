import { useState, type DragEvent } from "react";
import {
  hasDragItem,
  ITEM_DRAG_TYPE,
  readDragItem,
  type DragItem,
} from "./drag-item";

interface Options {
  dragItem: DragItem;
  isDraggable: boolean;
  onDropItem?: (item: DragItem) => void;
}

export function useItemDrag({ dragItem, isDraggable, onDropItem }: Options) {
  const [isDropActive, setIsDropActive] = useState(false);

  function canDrop(event: DragEvent) {
    return !!onDropItem && hasDragItem(event.dataTransfer);
  }

  const dragProps = {
    draggable: isDraggable,
    onDragStart: (event: DragEvent) => {
      event.dataTransfer.setData(ITEM_DRAG_TYPE, JSON.stringify(dragItem));
      event.dataTransfer.effectAllowed = "move";
    },
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

  return { isDropActive, dragProps };
}
