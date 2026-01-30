import { FontFamily, LayoutType, ResumeData, ThemeType } from '../types';

import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Route, Routes } from 'react-router-dom';

// Features
import ResumeForm from '../features/ResumeForm';
import ResumeTemplate from '../features/ResumeTemplate';

// Sections
import DownloadButton from './sections/DownloadButton';
import SidebarHeader from './sections/Sidebar';

// Constants & Data
import { fontFamilies } from '../constants/themes';
import dummyResumeData from '../data';
import {
  LOCAL_STORAGE_FONT_FAMILY_KEY,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_THEME_KEY,
} from '../constants';
import { usePersistentState } from '../hooks/usePersistentState';

const App: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<LayoutType>('classic');

  // States using persistence hook
  const [resumeData, setResumeData] = usePersistentState<ResumeData>(
    LOCAL_STORAGE_KEY,
    dummyResumeData,
  );
  const [theme, setTheme] = usePersistentState<ThemeType>(
    LOCAL_STORAGE_THEME_KEY,
    'default',
  );
  const [fontFamily, setFontFamily] = usePersistentState<FontFamily>(
    LOCAL_STORAGE_FONT_FAMILY_KEY,
    fontFamilies[0],
  );

  useEffect(() => {
    const root = document.documentElement;

    // Using if/else for side effects instead of a ternary
    if (theme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }

    // Persist to local storage (from your previous turn)
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'NS_CV_Resume',
  });

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR EDITOR */}
      <aside className="sidebar">
        <SidebarHeader
          currentTheme={theme}
          setTheme={setTheme}
          currentFontFamily={fontFamily}
          onFontFamilyChange={setFontFamily}
          setLayout={setLayout}
          currentLayout={layout}
        />
        <div className="sidebar-content">
          <Routes>
            <Route
              path="/*"
              element={
                <ResumeForm
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                />
              }
            />
          </Routes>
        </div>
      </aside>

      {/* RIGHT PREVIEW AREA */}
      <main className="preview-area preview-scroll">
        <DownloadButton onClick={handlePrint} />
        <div className="preview-sheet-wrapper">
          <div ref={componentRef} className="resume-print-container">
            <ResumeTemplate
              data={resumeData}
              theme={theme}
              fontFamily={fontFamily}
              layout={layout}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
