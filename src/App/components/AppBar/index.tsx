import React, { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

import CVCustomizer from '../../sections/CVCustomizer';
import DownloadButton from '../../sections/DownloadButton';

interface AppBarProps {
  onDownload: () => void;
}

/**
 * Global top bar: branding (left) + customize popover & download (right).
 * Consistent across every breakpoint. The theme/layout/font controls live in a
 * popover so the bar stays clean on narrow screens.
 */
const AppBar: React.FC<AppBarProps> = ({ onDownload }) => {
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const customizeRef = useRef<HTMLDivElement>(null);

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
            <div className="appbar__popover" role="dialog" aria-label="Customize resume">
              <CVCustomizer />
            </div>
          )}
        </div>

        <DownloadButton onClick={onDownload} />
      </div>
    </header>
  );
};

export default AppBar;
