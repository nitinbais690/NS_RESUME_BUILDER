import { useLayoutEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { pickStyle, useResumeStore } from '../../store/useResumeStore';

/**
 * Distance from the document top in layout px. Offsets ignore CSS transforms,
 * so neither the preview's scale nor the sections' entrance animations (which
 * restart whenever the preview pane is shown on a phone) skew the result.
 */
const layoutTop = (el: HTMLElement) => {
  let y = 0;
  for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) y += e.offsetTop;
  return y;
};

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
      if (!page || page.offsetHeight === 0) return; // hidden pane: keep the last value
      const top = layoutTop(page);
      const header = page.querySelector<HTMLElement>('.template-resume-header');
      let bottom = header ? layoutTop(header) + header.offsetHeight : top;
      page
        .querySelectorAll<HTMLElement>('.template-left-column, .template-right-column')
        .forEach((col) => {
          const last = col.lastElementChild as HTMLElement | null;
          if (!last || getComputedStyle(col).display === 'none') return;
          const padding = parseFloat(getComputedStyle(col).paddingBottom) || 0;
          bottom = Math.max(bottom, layoutTop(last) + last.offsetHeight + padding);
        });
      setHeight(bottom - top);
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
