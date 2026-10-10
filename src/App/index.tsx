import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import AppShell from './components/AppShell';
import SharedView from './components/SharedView';
import UpdateToast from './components/UpdateToast';
import { useResumeStore } from '../store/useResumeStore';
import { useUndoRedo } from './hooks/useUndoRedo';
import { useColorScheme } from './hooks/useColorScheme';

const App: React.FC = () => {
  const theme = useResumeStore((state) => state.theme);

  useUndoRedo();
  useColorScheme();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <>
      <Routes>
        <Route path="/view" element={<SharedView />} />
        <Route path="/*" element={<AppShell />} />
      </Routes>
      <UpdateToast />
    </>
  );
};

export default App;
