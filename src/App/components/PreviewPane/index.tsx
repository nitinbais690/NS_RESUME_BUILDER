import React from 'react';

import ResumeTemplate from '../../../features/ResumeTemplate';
import { usePreviewScale } from '../../hooks/usePreviewScale';

interface PreviewPaneProps {
  /** react-to-print target — must wrap ONLY the resume sheet. */
  printRef: React.RefObject<HTMLDivElement | null>;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ printRef }) => {
  const { containerRef, contentRef, scale, frameHeight } = usePreviewScale();

  return (
    <div className="preview" ref={containerRef}>
      {/* Height-compensating frame: a scaled element still reserves its
          unscaled box, so we reserve the real scaled height here. */}
      <div className="preview__frame" style={{ height: frameHeight }}>
        <div
          className="preview__scaler"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          <div ref={contentRef} className="preview__measure">
            {/* printRef wraps only the resume — never the scaler chrome. */}
            <div ref={printRef} className="resume-print-container">
              <ResumeTemplate />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPane;
