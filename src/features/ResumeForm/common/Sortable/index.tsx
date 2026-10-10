import React from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableListProps {
  ids: string[];
  onMove: (from: number, to: number) => void;
  children: React.ReactNode;
}

/**
 * Vertical drag-and-drop list. Dragging starts only from a DragHandle, so
 * scrolling and text selection on touch screens keep working. Keyboard: focus a
 * handle, Space to pick up, arrows to move, Space to drop, Escape to cancel.
 */
export const SortableList: React.FC<SortableListProps> = ({ ids, onMove, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    onMove(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

type HandleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Makes one list row sortable. Spread `rowProps` on the row element and pass
 * `handleProps` to a <DragHandle>.
 */
export const useSortableRow = (id: string) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return {
    rowProps: {
      ref: setNodeRef,
      style: {
        transform: CSS.Translate.toString(transform),
        transition,
        position: 'relative' as const,
        zIndex: isDragging ? 5 : undefined,
      },
      'data-dragging': isDragging || undefined,
    },
    handleProps: {
      ...attributes,
      ...listeners,
      ref: setActivatorNodeRef,
    } as HandleProps & { ref: (el: HTMLElement | null) => void },
  };
};

export const DragHandle: React.FC<{ label: string; handleProps: ReturnType<typeof useSortableRow>['handleProps'] }> = ({
  label,
  handleProps,
}) => (
  <button type="button" className="drag-handle" aria-label={`Reorder ${label}`} {...handleProps}>
    <GripVertical size={16} />
  </button>
);
