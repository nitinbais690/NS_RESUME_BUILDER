import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, Undo2, Redo2 } from 'lucide-react';

import CVCustomizer from '../../sections/CVCustomizer';
import DownloadButton from '../../sections/DownloadButton';
import CompletenessBar from '../CompletenessBar';
import { useCompleteness } from '../../hooks/useCompleteness';
import { useResumeStore } from '../../../store/useResumeStore';

interface AppBarProps {
  onDownload: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ onDownload }) => {
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const customizeRef = useRef<HTMLDivElement>(null);

  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const canUndo = useResumeStore((s) => s._past.length > 0);
  const canRedo = useResumeStore((s) => s._future.length > 0);
  const score = useCompleteness();

  useEffect(() => {
    if (!customizeOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        customizeRef.current &&
        !customizeRef.current.contains(e.target as Node)
      ) {
        setCustomizeOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCustomizeOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [customizeOpen]);

  const handleDownload = useCallback(() => {
    setIsDownloading(true);
    onDownload();
    const timer = setTimeout(() => setIsDownloading(false), 1500);
    return () => clearTimeout(timer);
  }, [onDownload]);

  return (
    <header className="appbar">
      <div className="appbar__brand">
        <img
          className="appbar__logo"
          src={`${process.env.PUBLIC_URL}/apple-touch-icon.png`}
          alt="NS Studio"
          width={36}
          height={36}
        />
        <h1 className="appbar__title">
          NS<span>Studio</span>
        </h1>
      </div>

      <div className="appbar__actions">
        <div className="appbar__history">
          <button
            type="button"
            className="appbar__history-btn"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            className="appbar__history-btn"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 size={15} />
          </button>
        </div>

        <div className="appbar__actions-separator" aria-hidden="true" />

        <CompletenessBar score={score} />

        <div className="appbar__customize" ref={customizeRef}>
          <button
            type="button"
            className={`appbar__customize-trigger ${customizeOpen ? 'is-open' : ''}`}
            aria-expanded={customizeOpen}
            aria-haspopup="dialog"
            onClick={() => setCustomizeOpen((o) => !o)}
          >
            <SlidersHorizontal size={16} />
            <span>Customize</span>
          </button>
          {customizeOpen && (
            <div
              className="appbar__popover"
              role="dialog"
              aria-label="Customize resume"
            >
              <p className="appbar__popover-title">Resume Style</p>
              <CVCustomizer />
            </div>
          )}
        </div>

        <div className="appbar__actions-separator" aria-hidden="true" />

        <DownloadButton onClick={handleDownload} isLoading={isDownloading} />
      </div>
    </header>
  );
};

export default AppBar;
