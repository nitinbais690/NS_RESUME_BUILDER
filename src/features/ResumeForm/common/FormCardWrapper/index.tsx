import React, { useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Props {
  onRemove: () => void;
  children: React.ReactNode;
  title?: string;
  index?: number;
}

export const FormCardWrapper: React.FC<Props> = ({
  onRemove,
  children,
  title,
  index,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
      ref={cardRef}
      className={`form-card ${isRemoving ? 'is-removing' : ''}`}
    >
      <div className="form-card__header">
        <span className="form-card__title">
          {title}
          {typeof index === 'number' ? ` ${index}` : ''}
        </span>
        <button
          type="button"
          aria-label="Remove"
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
