import React, { useCallback, useState } from 'react';
import { SlidersHorizontal, Undo2, Redo2, Target, X } from 'lucide-react';

import CVCustomizer from '../../sections/CVCustomizer';
import DownloadButton from '../../sections/DownloadButton';
import CompletenessBar from '../CompletenessBar';
import ColorSchemeToggle from '../ColorSchemeToggle';
import ResumeMenu from '../ResumeMenu';
import SaveIndicator from '../SaveIndicator';
import JobMatchDialog from '../JobMatchDialog';
import { usePopover } from '../../hooks/usePopover';
import { useCompleteness } from '../../hooks/useCompleteness';
import { useResumeStore } from '../../../store/useResumeStore';

interface AppBarProps {
  onDownload: () => void | Promise<void>;
}

const AppBar: React.FC<AppBarProps> = ({ onDownload }) => {
  const customize = usePopover();
  const [isDownloading, setIsDownloading] = useState(false);
  const [jobMatchOpen, setJobMatchOpen] = useState(false);

  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const canUndo = useResumeStore((s) => s._past.length > 0);
  const canRedo = useResumeStore((s) => s._future.length > 0);
  const { score, items } = useCompleteness();

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } catch (err) {
      console.error(err);
      // After a deploy, the old page can't load the new PDF code chunk.
      const stale = err instanceof Error && /dynamically imported module|Failed to fetch|Importing a module/i.test(err.message);
      if (stale && window.confirm('A new version of NS Studio is available. Reload now to download your PDF? Your work is saved.')) {
        window.location.reload();
        return;
      }
      window.alert('Sorry, the PDF could not be created. Please try again.');
    } finally {
      // Print dialogs return immediately; keep the spinner briefly for feedback.
      setTimeout(() => setIsDownloading(false), 600);
    }
  }, [onDownload]);

  return (
    <header className="appbar">
      <div className="appbar__brand">
        <img
          className="appbar__logo"
          src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
          alt="NS Studio"
          width={36}
          height={36}
        />
        <h1 className="appbar__title">
          NS<span>Studio</span>
        </h1>
        <ResumeMenu />
        <SaveIndicator />
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
          <ColorSchemeToggle />
        </div>

        <div className="appbar__actions-separator" aria-hidden="true" />

        <CompletenessBar score={score} items={items} />

        <button
          type="button"
          className="appbar__customize-trigger"
          onClick={() => setJobMatchOpen(true)}
          title="Compare your resume with a job description"
        >
          <Target size={16} />
          <span>Job match</span>
        </button>
        <JobMatchDialog open={jobMatchOpen} onClose={() => setJobMatchOpen(false)} />

        <div className="appbar__customize" ref={customize.ref}>
          <button
            type="button"
            className={`appbar__customize-trigger ${customize.open ? 'is-open' : ''}`}
            aria-expanded={customize.open}
            aria-haspopup="dialog"
            onClick={() => customize.setOpen((o) => !o)}
          >
            <SlidersHorizontal size={16} />
            <span>Customize</span>
          </button>
          {customize.open && (
            <div
              className="appbar__popover"
              role="dialog"
              aria-label="Customize resume"
            >
              <div className="appbar__popover-head">
                <p className="appbar__popover-title">Resume Style</p>
                <button
                  type="button"
                  className="appbar__popover-close"
                  onClick={() => customize.setOpen(false)}
                  aria-label="Close customize panel"
                >
                  <X size={16} />
                </button>
              </div>
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
