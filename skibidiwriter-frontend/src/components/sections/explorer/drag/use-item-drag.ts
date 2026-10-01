import type { DragEvent } from "react";
import { ITEM_DRAG_TYPE, type DragItem } from "./drag-item";
import { useItemDrop } from "./use-item-drop";

interface Options {
  dragItem: DragItem;
  isDraggable: boolean;
  onDropItem?: (item: DragItem) => void;
}

export function useItemDrag({ dragItem, isDraggable, onDropItem }: Options) {
  const { isDropActive, dropProps } = useItemDrop(onDropItem);

  const dragProps = {
    ...dropProps,
    draggable: isDraggable,
    onDragStart: (event: DragEvent) => {
      event.dataTransfer.setData(ITEM_DRAG_TYPE, JSON.stringify(dragItem));
      event.dataTransfer.effectAllowed = "move";
    },
  };

  return { isDropActive, dragProps };
}
