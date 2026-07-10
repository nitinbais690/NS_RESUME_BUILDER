import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  isLoading = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isLoading}
    className={`btn-download--appbar ${isLoading ? 'is-loading' : ''}`}
  >
    {isLoading ? (
      <Loader2 size={16} className="btn-download__spinner" />
    ) : (
      <Download size={16} />
    )}
    <span>{isLoading ? 'Preparing…' : 'DOWNLOAD PDF'}</span>
  </button>
);

export default DownloadButton;
