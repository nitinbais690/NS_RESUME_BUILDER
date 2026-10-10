import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Download, PencilLine } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

import ResumeTemplate from '../../../features/ResumeTemplate';
import { parseShareHash } from '../../../lib/share';
import { useResumeStore } from '../../../store/useResumeStore';
import { usePreviewScale } from '../../hooks/usePreviewScale';
import { ContactInfo, ResumeField } from '../../../types';
import { exportAtsPdf } from '../../../features/ResumePdf/exportPdf';

/**
 * Read-only page for share links (/view#<data>). Renders the resume from the
 * hash only — it never reads or writes the visitor's own saved resumes, except
 * when they explicitly choose "Make a copy".
 */
const SharedView: React.FC = () => {
  const shared = useMemo(() => parseShareHash(window.location.hash), []);
  const importResume = useResumeStore((s) => s.importResume);
  const printRef = useRef<HTMLDivElement>(null);
  const { containerRef, contentRef, scale, frameHeight } = usePreviewScale();
  const print = useReactToPrint({ contentRef: printRef, documentTitle: 'Resume' });

  const name = shared?.data[ResumeField.CONTACT][ContactInfo.NAME];
  useEffect(() => {
    document.title = name ? `${name} — Resume` : 'Shared resume — NS Studio';
  }, [name]);

  if (!shared) {
    return (
      <div className="shared shared--error">
        <h1>This link doesn't contain a resume</h1>
        <p>It may have been cut off when it was copied. Ask for the link again.</p>
        <Link className="btn btn--primary" to="/">
          Build your own resume
        </Link>
      </div>
    );
  }

  const makeCopy = () => {
    importResume({
      name: name ? `${name} (shared)` : 'Shared resume',
      data: shared.data,
      style: shared.style,
    });
    window.location.assign('/');
  };

  return (
    <div className="shared">
      <header className="shared__bar">
        <span className="shared__label">Read-only resume</span>
        <div className="shared__actions">
          <button
            type="button"
            className="btn"
            onClick={() =>
              shared.style.layout === 'ats' ? exportAtsPdf(shared.data, shared.style) : print()
            }
          >
            <Download size={15} /> PDF
          </button>
          <button type="button" className="btn btn--primary" onClick={makeCopy}>
            <PencilLine size={15} /> Make an editable copy
          </button>
        </div>
      </header>

      <div className="preview shared__preview" ref={containerRef}>
        <div className="preview__frame" style={{ height: frameHeight }}>
          <div
            className="preview__scaler"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
          >
            <div ref={contentRef} className="preview__measure">
              <div ref={printRef} className="resume-print-container">
                <ResumeTemplate resume={shared} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedView;
