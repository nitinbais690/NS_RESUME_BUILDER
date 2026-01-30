import React from 'react';
import { PlusCircle } from 'lucide-react';
import Button from '../../../../App/common/Button';

interface AddButtonProps {
  onAdd: () => void;
  label?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onAdd, label = 'ADD NEW' }) => {
  return (
    <div className="form-btn-add-new-container">
      <Button onClick={onAdd}>
        <PlusCircle size={14} /> {label}
      </Button>
    </div>
  );
};

export default AddButton;
