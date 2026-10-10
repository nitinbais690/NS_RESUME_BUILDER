import { useLayoutEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { pickStyle, useResumeStore } from '../../store/useResumeStore';

/**
 * Real height of the resume's content in unscaled px. The sheet itself has an
 * A4 min-height and stretched columns, so its box height can't tell "fits"
 * from "overflows". Instead this finds where the last section actually ends.
 */
export const useContentHeight = (
  contentRef: React.RefObject<HTMLElement | null>,
  scale: number,
) => {
  const data = useResumeStore((s) => s.resumeData);
  const style = useResumeStore(useShallow(pickStyle));
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const root = contentRef.current;
    if (!root || !scale) return;

    const measure = () => {
      const page = root.querySelector<HTMLElement>('.template-resume-page');
      if (!page) return;
      const top = page.getBoundingClientRect().top;
      let bottom = page.querySelector('.template-resume-header')?.getBoundingClientRect().bottom ?? top;
      page
        .querySelectorAll<HTMLElement>('.template-left-column, .template-right-column')
        .forEach((col) => {
          const last = col.lastElementChild;
          if (!last || getComputedStyle(col).display === 'none') return;
          const padding = parseFloat(getComputedStyle(col).paddingBottom) || 0;
          bottom = Math.max(bottom, last.getBoundingClientRect().bottom + padding * scale);
        });
      setHeight((bottom - top) / scale);
    };

    // After paint, so fonts/layout from this change have settled.
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [contentRef, scale, data, style]);

  return height;
};
