import { Trash2 } from 'lucide-react';

interface Props {
  onRemove: () => void;
  children: React.ReactNode;
}

export const FormCardWrapper = ({ onRemove, children }: Props) => (
  <div className="form-card">
    <button onClick={onRemove} className="form-btn-remove">
      <Trash2 size={14} />
    </button>
    {children}
  </div>
);
