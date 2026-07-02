import { useLayoutEffect, useRef, useState } from 'react';

// Fallback only. The real sheet width is measured from the DOM (see below),
// which sidesteps any mm→px drift with --a4-width (210mm).
const A4_WIDTH_FALLBACK_PX = 793.7;

interface PreviewScale {
  /** The scroll container that bounds the available width. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** The unscaled resume sheet, measured for its natural width/height. */
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** Scale factor applied to the sheet so it fits the container (never > 1). */
  scale: number;
  /** Height the scaled sheet actually occupies, for the compensating frame. */
  frameHeight?: number;
}

/**
 * Fits the fixed-size resume sheet to its container width via `transform: scale`.
 * Replaces the old hardcoded per-breakpoint scale magic numbers.
 *
 * ResizeObserver's contentRect reports *layout* (untransformed) size, so we can
 * safely measure the sheet's natural dimensions even while it's scaled.
 */
export const usePreviewScale = (): PreviewScale => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [frameHeight, setFrameHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let availWidth = 0;
    let naturalWidth = 0;
    let naturalHeight = 0;

    const recompute = () => {
      // Skip while hidden (display:none → width 0) to avoid collapsing to scale 0.
      if (!availWidth || !naturalWidth) return;
      const next = Math.min(availWidth / naturalWidth, 1);
      setScale(next);
      setFrameHeight(naturalHeight * next);
    };

    const containerRO = new ResizeObserver(([entry]) => {
      availWidth = entry.contentRect.width;
      recompute();
    });
    const contentRO = new ResizeObserver(([entry]) => {
      naturalWidth = entry.contentRect.width || A4_WIDTH_FALLBACK_PX;
      naturalHeight = entry.contentRect.height;
      recompute();
    });

    containerRO.observe(container);
    contentRO.observe(content);
    return () => {
      containerRO.disconnect();
      contentRO.disconnect();
    };
  }, []);

  return { containerRef, contentRef, scale, frameHeight };
};
