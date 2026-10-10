/** A4 height in CSS px (297mm at 96dpi): the unscaled resume sheet's page size. */
export const A4_HEIGHT_PX = (297 * 96) / 25.4;
// Borders and sub-pixel rounding shouldn't count as "spilling over".
const TOLERANCE_PX = 6;

export interface PageFit {
  pages: number;
  /** How far past the last full page the content runs, 0–1 (0 when it fits). */
  overflow: number;
  fitsOnePage: boolean;
}

export const getPageFit = (contentHeightPx: number): PageFit => {
  const effective = Math.max(0, contentHeightPx - TOLERANCE_PX);
  const pages = Math.max(1, Math.ceil(effective / A4_HEIGHT_PX));
  const overflow = pages > 1 ? (effective - (pages - 1) * A4_HEIGHT_PX) / A4_HEIGHT_PX : 0;
  return { pages, overflow, fitsOnePage: pages === 1 };
};
