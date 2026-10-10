import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

import { useResumeStore } from '../../../store/useResumeStore';
import { ColorScheme } from '../../../types';

const NEXT: Record<ColorScheme, ColorScheme> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const ICON = { system: Monitor, light: Sun, dark: Moon };
const LABEL = { system: 'System theme', light: 'Light theme', dark: 'Dark theme' };

/** Cycles system → light → dark. Icon shows the current mode. */
const ColorSchemeToggle: React.FC = () => {
  const colorScheme = useResumeStore((s) => s.colorScheme);
  const setColorScheme = useResumeStore((s) => s.setColorScheme);
  const Icon = ICON[colorScheme];

  return (
    <button
      type="button"
      className="appbar__history-btn appbar__scheme-btn"
      onClick={() => setColorScheme(NEXT[colorScheme])}
      title={`${LABEL[colorScheme]} (click to switch)`}
      aria-label={`${LABEL[colorScheme]}, switch to ${LABEL[NEXT[colorScheme]]}`}
    >
      <Icon size={15} />
    </button>
  );
};

export default ColorSchemeToggle;
