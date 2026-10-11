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
import { ContactInfo, ResumeField } from '../../../types';
import { slugify } from '../../../lib/resumeIO';

// Phones and tablets: react-to-print's hidden-iframe printing is unreliable
// there (blank pages or nothing at all), so print the page itself; the
// @media print rules in main.scss already reduce it to just the resume.
const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

// An installed app on Android ignores window.print(), so offer the real PDF.
const isAndroidInstalledApp = () =>
  /android/i.test(navigator.userAgent) && window.matchMedia('(display-mode: standalone)').matches;

/** Prints the live page; the document title becomes the suggested file name. */
const printPage = (fileName: string) => {
  const previous = document.title;
  document.title = fileName;
  const restore = () => {
    document.title = previous;
    window.removeEventListener('afterprint', restore);
  };
  window.addEventListener('afterprint', restore);
  window.print();
};

/**
 * Responsive app shell:
 *  - Desktop (>=1024): editor + preview side by side, section icon rail visible.
 *  - Mobile / tablet-portrait (<1024): one pane at a time, toggled by the
 *    bottom tab bar via the `?pane` URL param (data-pane drives visibility).
 */
const AppShell: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [pane] = usePaneMode();

  // Suggested PDF file name, e.g. "alex-johnson-resume".
  const name = useResumeStore((s) => s.resumeData[ResumeField.CONTACT][ContactInfo.NAME]);
  const fileName = `${slugify(name || 'resume')}-resume`;

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: fileName,
    // If the iframe route fails, print the page directly instead of silently doing nothing.
    onPrintError: (_location, error) => {
      console.error(error);
      printPage(fileName);
    },
  });

  // ATS layout → real react-pdf file (selectable text, clean page breaks).
  // Styled layouts → browser print, which preserves the exact on-screen design.
  const handleDownload = async () => {
    const { layout, getActiveResume } = useResumeStore.getState();
    const { data, style } = getActiveResume();
    if (layout === 'ats') {
      await exportAtsPdf(data, style);
    } else if (isAndroidInstalledApp()) {
      const ok = window.confirm(
        "Printing isn't available in the installed app. Download this resume as an ATS-safe PDF file instead?",
      );
      if (ok) await exportAtsPdf(data, style);
    } else if (isTouchDevice()) {
      printPage(fileName);
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
