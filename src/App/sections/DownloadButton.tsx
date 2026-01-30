import React from 'react';
import { Download } from 'lucide-react';
import Button from '../common/Button'; // Import the fixed Button

interface DownloadButtonProps {
  onClick: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <Download size={18} /> DOWNLOAD PDF
    </Button>
  );
};

export default DownloadButton;
