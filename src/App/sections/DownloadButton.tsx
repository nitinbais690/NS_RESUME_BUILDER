import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick }) => (
  <button type="button" onClick={onClick} className="btn-download--appbar">
    <Download size={16} /> <span>DOWNLOAD PDF</span>
  </button>
);

export default DownloadButton;
