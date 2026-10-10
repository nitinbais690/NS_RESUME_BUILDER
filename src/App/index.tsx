import React, { useEffect } from 'react';

import AppShell from './components/AppShell';
import { useResumeStore } from '../store/useResumeStore';
import { useUndoRedo } from './hooks/useUndoRedo';

const App: React.FC = () => {
  const theme = useResumeStore((state) => state.theme);

  useUndoRedo();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return <AppShell />;
};

export default App;
