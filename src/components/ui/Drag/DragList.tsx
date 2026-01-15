import { type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  type SortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/ui/Drag/SortableItem";

interface DraggableListProps<T> {
  items: T[];
  onReorder: (items: T[], sourceId: string, targetId: string, where: "PREV" | "NEXT") => void;
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  className?: string;
  canDrag?: boolean;
  strategy?: SortingStrategy;
}

export function DragList<T>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
  canDrag = true,
  strategy = verticalListSortingStrategy,
}: DraggableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => keyExtractor(item) === active.id);
      const newIndex = items.findIndex((item) => keyExtractor(item) === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      onReorder(
        newItems,
        String(active.id),
        String(over.id),
        oldIndex > newIndex ? "PREV" : "NEXT"
      );
    }
  };

  const itemIds = items.map(keyExtractor);

  return canDrag ? (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={strategy}>
        <>
          {items.map((item, index) => {
            const id = keyExtractor(item);
            return (
              <SortableItem key={id} id={id}>
                {renderItem(item, index)}
              </SortableItem>
            );
          })}
        </>
      </SortableContext>
    </DndContext>
  ) : (
    <>{items.map((item, index) => renderItem(item, index))}</>
  );
}
