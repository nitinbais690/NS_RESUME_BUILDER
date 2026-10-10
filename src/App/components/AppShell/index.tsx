import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Route, Routes } from 'react-router-dom';

import ResumeForm from '../../../features/ResumeForm';
import AppBar from '../AppBar';
import SectionRail from '../SectionRail';
import PreviewPane from '../PreviewPane';
import MobileTabBar from '../MobileTabBar';
import { usePaneMode } from '../../hooks/usePaneMode';
import { useResumeStore } from '../../../store/useResumeStore';
import { exportAtsPdf } from '../../../features/ResumePdf/exportPdf';

/**
 * Responsive app shell:
 *  - Desktop (>=1024): editor + preview side by side, section icon rail visible.
 *  - Mobile / tablet-portrait (<1024): one pane at a time, toggled by the
 *    bottom tab bar via the `?pane` URL param (data-pane drives visibility).
 */
const AppShell: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [pane] = usePaneMode();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'NS_Studio_Resume',
  });

  // ATS layout → real react-pdf file (selectable text, clean page breaks).
  // Styled layouts → browser print, which preserves the exact on-screen design.
  const handleDownload = async () => {
    const { layout, getActiveResume } = useResumeStore.getState();
    if (layout === 'ats') {
      const { data, style } = getActiveResume();
      await exportAtsPdf(data, style);
    } else {
      handlePrint();
    }
  };

  return (
    <div className="shell" data-pane={pane}>
      <AppBar onDownload={handleDownload} />

      <div className="shell__body">
        {/* EDITOR PANE */}
        <section className="shell__pane shell__pane--edit">
          <SectionRail />
          <div className="shell__editor-scroll">
            <Routes>
              <Route path="/*" element={<ResumeForm />} />
            </Routes>
          </div>
        </section>

        {/* PREVIEW PANE */}
        <section className="shell__pane shell__pane--preview">
          <PreviewPane printRef={componentRef} />
        </section>
      </div>

      <MobileTabBar />
    </div>
  );
};

export default AppShell;
