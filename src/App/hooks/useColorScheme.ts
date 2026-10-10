import { useEffect } from 'react';

import { useResumeStore } from '../../store/useResumeStore';

const DARK_QUERY = '(prefers-color-scheme: dark)';
// Mirrors --color-bg-white for each scheme so the mobile browser chrome matches.
const THEME_COLOR = { light: '#ffffff', dark: '#1b1e24' } as const;

/**
 * Resolves the stored colorScheme preference ('system' follows the OS) and
 * writes it to <html data-color-scheme>, which global.scss keys dark tokens off.
 * public/index.html applies the same attribute before first paint to avoid a flash.
 */
export const useColorScheme = () => {
  const colorScheme = useResumeStore((s) => s.colorScheme);

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);

    const apply = () => {
      const resolved =
        colorScheme === 'system'
          ? media.matches
            ? 'dark'
            : 'light'
          : colorScheme;
      document.documentElement.setAttribute('data-color-scheme', resolved);
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', THEME_COLOR[resolved]);
    };

    apply();
    if (colorScheme !== 'system') return;
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [colorScheme]);
};
