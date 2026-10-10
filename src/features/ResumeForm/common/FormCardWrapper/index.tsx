import React, { useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';

import { DragHandle, useSortableRow } from '../Sortable';

interface Props {
  /** Entity id: drag-and-drop key, and the target for click-to-edit from the preview. */
  id: string;
  onRemove: () => void;
  children: React.ReactNode;
  title?: string;
  index?: number;
}

export const FormCardWrapper: React.FC<Props> = ({
  id,
  onRemove,
  children,
  title,
  index,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { rowProps, handleProps } = useSortableRow(id);
  const label = `${title ?? 'item'}${typeof index === 'number' ? ` ${index}` : ''}`;

  const handleRemove = () => {
    setIsRemoving(true);
    const card = cardRef.current;
    if (!card) {
      onRemove();
      return;
    }
    const onEnd = () => {
      card.removeEventListener('animationend', onEnd);
      onRemove();
    };
    card.addEventListener('animationend', onEnd);
  };

  return (
    <div
      {...rowProps}
      ref={(el) => {
        cardRef.current = el;
        rowProps.ref(el);
      }}
      data-edit-id={id}
      className={`form-card ${isRemoving ? 'is-removing' : ''}`}
    >
      <div className="form-card__header">
        <div className="form-card__heading">
          <DragHandle label={label} handleProps={handleProps} />
          <span className="form-card__title">{label}</span>
        </div>
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={handleRemove}
          className="form-card__remove"
        >
          <Trash2 size={14} />
          <span className="form-card__remove-label">Remove</span>
        </button>
      </div>
      <div className="form-card__body">{children}</div>
    </div>
  );
};
