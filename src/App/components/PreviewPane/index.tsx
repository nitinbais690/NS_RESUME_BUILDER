import React from 'react';

import ResumeTemplate from '../../../features/ResumeTemplate';
import { usePreviewScale } from '../../hooks/usePreviewScale';
import { useJumpToField } from '../../hooks/useJumpToField';
import { useContentHeight } from '../../hooks/useContentHeight';
import { A4_HEIGHT_PX, getPageFit } from '../../../lib/pageFit';
import PageFitBadge from './PageFitBadge';

interface PreviewPaneProps {
  /** react-to-print target — must wrap ONLY the resume sheet. */
  printRef: React.RefObject<HTMLDivElement | null>;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ printRef }) => {
  const { containerRef, contentRef, scale, frameHeight } = usePreviewScale();
  const jumpToField = useJumpToField();
  const naturalHeight = useContentHeight(contentRef, scale);
  const fit = getPageFit(naturalHeight);

  return (
    <div className="preview-wrap">
      {/* Outside the scroller so it stays visible while scrolling. */}
      {naturalHeight > 0 && <PageFitBadge fit={fit} />}
      <div
        className="preview preview--editable"
        ref={containerRef}
        onClick={jumpToField}
        title="Click any part of the resume to edit it"
      >
        {/* Height-compensating frame: a scaled element still reserves its
          unscaled box, so we reserve the real scaled height here. */}
        <div className="preview__frame" style={{ height: frameHeight }}>
          <div
            className="preview__scaler"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
          >
            <div ref={contentRef} className="preview__measure">
              {/* printRef wraps only the resume — never the scaler chrome. */}
              <div ref={printRef} className="resume-print-container">
                <ResumeTemplate />
              </div>
              {/* Page-break guides: outside printRef, so they never print. */}
              {Array.from({ length: fit.pages - 1 }, (_, i) => (
                <div
                  key={i}
                  className="page-break-guide"
                  style={{ top: A4_HEIGHT_PX * (i + 1) }}
                  aria-hidden="true"
                >
                  <span>Page {i + 2}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPane;
