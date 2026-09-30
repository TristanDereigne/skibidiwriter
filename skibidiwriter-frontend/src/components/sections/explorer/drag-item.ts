export const ITEM_DRAG_TYPE = "application/x-skibidi-item";

export interface DragItem {
  kind: "folder" | "document";
  id: string;
}

export function readDragItem(data: DataTransfer): DragItem | null {
  try {
    return JSON.parse(data.getData(ITEM_DRAG_TYPE)) as DragItem;
  } catch {
    return null;
  }
}

export function hasDragItem(data: DataTransfer) {
  return data.types.includes(ITEM_DRAG_TYPE);
}
