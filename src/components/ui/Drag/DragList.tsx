import { type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  type SortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/ui/Drag/SortableItem";

const restrictToVerticalAxis: Modifier = ({ transform }) => {
  return {
    ...transform,
    x: 0,
  };
};

const restrictToParentElement: Modifier = ({ transform, draggingNodeRect, containerNodeRect }) => {
  if (!draggingNodeRect || !containerNodeRect) {
    return transform;
  }

  return {
    ...transform,
    y: Math.max(
      containerNodeRect.top - draggingNodeRect.top,
      Math.min(transform.y ?? 0, containerNodeRect.bottom - draggingNodeRect.bottom)
    ),
    x: Math.max(
      containerNodeRect.left - draggingNodeRect.left,
      Math.min(transform.x ?? 0, containerNodeRect.right - draggingNodeRect.right)
    ),
  };
};

interface DraggableListProps<T> {
  items: T[];
  onReorder: (items: T[], sourceId: string, targetId: string, where: "PREV" | "NEXT") => void;
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  canDrag?: boolean;
  strategy?: SortingStrategy;
  modifiers?: Modifier[];
  className?: string;
  onDragStateChange?: (isDragging: boolean) => void;
}

export function DragList<T>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
  canDrag = true,
  strategy = verticalListSortingStrategy,
  modifiers,
  className,
  onDragStateChange,
}: Readonly<DraggableListProps<T>>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: canDrag ? 0 : 999999, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    onDragStateChange?.(true);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    onDragStateChange?.(false);

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

  const defaultModifiers =
    strategy === verticalListSortingStrategy
      ? [restrictToVerticalAxis, restrictToParentElement]
      : [restrictToParentElement];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={modifiers ?? defaultModifiers}
    >
      <SortableContext items={itemIds} strategy={strategy}>
        <div className={className}>
          {items.map((item, index) => {
            const id = keyExtractor(item);
            return (
              <SortableItem key={id} id={id}>
                {renderItem(item, index)}
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
