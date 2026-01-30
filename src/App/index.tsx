import React, { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Route, Routes } from 'react-router-dom';

// Features
import ResumeForm from '../features/ResumeForm';
import ResumeTemplate from '../features/ResumeTemplate';

// Sections
import DownloadButton from './sections/DownloadButton';
import SidebarHeader from './sections/Sidebar';

import { useResumeStore } from '../store/useResumeStore';

const App: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  // Read UI state from store for side effects (theme)
  const theme = useResumeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'NS_CV_Resume',
  });

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR EDITOR */}
      <aside className="sidebar">
        <SidebarHeader />
        <div className="sidebar-content">
          <Routes>
            <Route
              path="/*"
              element={<ResumeForm />}
            />
          </Routes>
        </div>
      </aside>

      {/* RIGHT PREVIEW AREA */}
      <main className="preview-area preview-scroll">
        <DownloadButton onClick={handlePrint} />
        <div className="preview-sheet-wrapper">
          <div ref={componentRef} className="resume-print-container">
            <ResumeTemplate />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
