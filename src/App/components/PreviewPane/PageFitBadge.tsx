import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

import { PageFit } from '../../../lib/pageFit';
import { useResumeStore } from '../../../store/useResumeStore';

/** One-page fit check shown over the preview, with a one-click fix to try. */
const PageFitBadge: React.FC<{ fit: PageFit }> = ({ fit }) => {
  const fontScale = useResumeStore((s) => s.fontScale);
  const setFontScale = useResumeStore((s) => s.setFontScale);
  const spacingScale = useResumeStore((s) => s.spacingScale);
  const setSpacingScale = useResumeStore((s) => s.setSpacingScale);

  if (fit.fitsOnePage) {
    return (
      <div className="page-fit page-fit--ok" role="status">
        <CheckCircle2 size={14} aria-hidden="true" /> Fits on 1 page
      </div>
    );
  }

  const percentOver = Math.max(1, Math.round(fit.overflow * 100));
  const canShrink = fontScale > 0.85;
  const canTighten = spacingScale > 0.75;

  return (
    <div
      className="page-fit page-fit--warn"
      role="status"
      // Don't let clicks here trigger the preview's click-to-edit.
      onClick={(e) => e.stopPropagation()}
    >
      <AlertTriangle size={14} aria-hidden="true" />
      <span>
        {fit.pages} pages: {percentOver}% onto page {fit.pages}
      </span>
      {canShrink && (
        <button
          type="button"
          className="page-fit__fix"
          onClick={() => setFontScale(Math.round((fontScale - 0.05) * 100) / 100)}
          title="Reduce font size by 5%"
        >
          Shrink text
        </button>
      )}
      {canTighten && (
        <button
          type="button"
          className="page-fit__fix"
          onClick={() => setSpacingScale(spacingScale - 0.1)}
          title="Reduce spacing by 10%"
        >
          Tighten spacing
        </button>
      )}
    </div>
  );
};

export default PageFitBadge;
