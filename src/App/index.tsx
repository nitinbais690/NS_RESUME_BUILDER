import React, { useEffect } from 'react';

import AppShell from './components/AppShell';
import { useResumeStore } from '../store/useResumeStore';

const App: React.FC = () => {
  // Mirror the selected theme onto the document root for CSS variable overrides.
  const theme = useResumeStore((state) => state.theme);

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
