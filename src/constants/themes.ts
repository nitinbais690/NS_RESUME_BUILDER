import { FontFamily, LayoutType, ThemeType } from '../types';

export const fontFamilies: Array<FontFamily> = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Arial',
];

/** ATS-first single-column layouts come first; designed layouts after. */
export const layouts: Array<LayoutType> = [
  'compact',
  'tech',
  'harvard',
  'professional',
  'elegant',
  'sidebar',
  'ats',
  'classic',
  'modern',
  'executive',
];

export const layoutLabels: Record<LayoutType, string> = {
  compact: 'Compact',
  tech: 'Tech',
  harvard: 'Harvard',
  professional: 'Professional',
  elegant: 'Elegant',
  sidebar: 'Sidebar',
  ats: 'ATS-safe',
  classic: 'Classic',
  modern: 'Modern',
  executive: 'Executive',
};

/** One-line hint shown on hover and under the picker. */
export const layoutHints: Record<LayoutType, string> = {
  compact: 'Densest single column: fits the most on one page. Great ATS score.',
  tech: "Engineering classic (after Jake's Resume): serif, small caps, one column.",
  harvard: 'Career-office classic: bold organization, italic title, serif, one column.',
  professional: 'Name and links left, email and phone right; centered headings, TITLE | COMPANY lines.',
  elegant: 'Centered serif with a double rule and headings set between lines; skills as a grid.',
  sidebar:
    'Contact and credentials on the left; summary, skills and experience on the right. For strict portals, Compact is safer.',
  ats: 'Plain Arial, downloads as a real text PDF. Safest for upload portals.',
  classic: 'Sidebar design. Two columns can confuse older ATS parsers.',
  modern: 'Single column with accent colors.',
  executive: 'Two columns, main content left. Best for sending directly.',
};

/** Single-column layouts that follow ATS parsing rules. */
export const ATS_LAYOUTS: ReadonlySet<LayoutType> = new Set([
  'compact',
  'tech',
  'harvard',
  'professional',
  'elegant',
  'sidebar',
  'ats',
]);

/** Removed layouts → closest current one, so old saves and links still load. */
export const LEGACY_LAYOUTS: Record<string, LayoutType> = {
  minimalist: 'harvard',
  creative: 'classic',
};

const themes = [
  {
    name: 'default' as ThemeType,
    color: '#7A1B1B',
  },
  {
    name: 'blue' as ThemeType,
    color: '#1e40af',
  },
  { name: 'teal' as ThemeType, color: '#0f766e' },
  {
    name: 'purple' as ThemeType,
    color: '#6b21a8',
  },
];

export default themes;
