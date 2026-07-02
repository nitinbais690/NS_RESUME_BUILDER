import React from 'react';
import { Plus } from 'lucide-react';

interface AddButtonProps {
  onAdd: () => void;
  label?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onAdd, label = 'Add Item' }) => {
  return (
    <button type="button" className="form-btn-add" onClick={onAdd}>
      <Plus size={16} />
      <span>{label}</span>
    </button>
  );
};

export default AddButton;
