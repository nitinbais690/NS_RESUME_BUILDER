import { FontFamily, LayoutType, ThemeType } from '../types';

/** Shared theme definitions — colors used by both the web SCSS variables and the mobile theme builder. */
export const themesConfig: Array<{
  name: ThemeType;
  color: string;
  fontFamily?: FontFamily;
}> = [
  { name: 'default', color: '#7A1B1B' },
  { name: 'blue', color: '#1e40af' },
  { name: 'teal', color: '#0f766e', fontFamily: 'Arial' },
  { name: 'purple', color: '#6b21a8' },
];

/** Ordered list of available layouts. */
export const layouts: Array<LayoutType> = [
  'classic',
  'modern',
  'minimalist',
  'executive',
  'creative',
];

/**
 * Web font families — includes the CSS stack suffix required for web.
 * Mobile should use the short names from `fontFamilies` instead.
 */
export const webFontFamilies: Array<FontFamily> = ['Inter', 'Roboto', 'Arial'];
