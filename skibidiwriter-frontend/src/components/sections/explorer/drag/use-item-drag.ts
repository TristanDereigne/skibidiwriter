import { useState, type DragEvent } from "react";
import {
  hasDragItem,
  ITEM_DRAG_TYPE,
  readDragItem,
  type DragItem,
} from "./drag-item";

interface Options {
  dragItem: DragItem;
  draggable: boolean;
  onDropItem?: (item: DragItem) => void;
}

export function useItemDrag({ dragItem, draggable, onDropItem }: Options) {
  const [dropActive, setDropActive] = useState(false);

  function canDrop(event: DragEvent) {
    return !!onDropItem && hasDragItem(event.dataTransfer);
  }

  const dragProps = {
    draggable,
    onDragStart: (event: DragEvent) => {
      event.dataTransfer.setData(ITEM_DRAG_TYPE, JSON.stringify(dragItem));
      event.dataTransfer.effectAllowed = "move";
    },
    onDragOver: (event: DragEvent) => {
      if (!canDrop(event)) return;
      event.preventDefault();
      event.stopPropagation();
      setDropActive(true);
    },
    onDragLeave: () => setDropActive(false),
    onDrop: (event: DragEvent) => {
      setDropActive(false);
      if (!canDrop(event)) return;
      event.preventDefault();
      event.stopPropagation();

      const item = readDragItem(event.dataTransfer);
      if (item) onDropItem?.(item);
    },
  };

  return { dropActive, dragProps };
}
