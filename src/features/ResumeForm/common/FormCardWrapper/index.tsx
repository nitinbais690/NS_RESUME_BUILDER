import { Trash2 } from 'lucide-react';

interface Props {
  onRemove: () => void;
  children: React.ReactNode;
  title?: string;
  index?: number;
}

export const FormCardWrapper = ({ onRemove, children, title, index }: Props) => (
  <div className="form-card">
    <div className="form-card__header">
      <span className="form-card__title">
        {title}
        {typeof index === 'number' ? ` ${index}` : ''}
      </span>
      <button
        type="button"
        aria-label="Remove"
        onClick={onRemove}
        className="form-card__remove"
      >
        <Trash2 size={14} />
        <span>Remove</span>
      </button>
    </div>
    <div className="form-card__body">{children}</div>
  </div>
);
