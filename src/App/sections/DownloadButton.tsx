import React from 'react';
import { Download } from 'lucide-react';
import Button from '../common/Button';

interface DownloadButtonProps {
  onClick: () => void;
  /** 'appbar' renders a plain inline button (no sticky container). */
  variant?: 'default' | 'appbar';
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  variant = 'default',
}) => {
  if (variant === 'appbar') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="btn-download--appbar"
      >
        <Download size={16} /> <span>DOWNLOAD PDF</span>
      </button>
    );
  }

  return (
    <Button onClick={onClick}>
      <Download size={18} /> DOWNLOAD PDF
    </Button>
  );
};

export default DownloadButton;
