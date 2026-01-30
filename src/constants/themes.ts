import { FontFamily, LayoutType, ThemeType } from '../types';

export const fontFamilies: Array<FontFamily> = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Arial',
];

export const layouts: Array<LayoutType> = [
  'classic',
  'modern',
  'minimalist',
  'executive',
  'creative',
];

const themes = [
  {
    name: 'default' as ThemeType,
    color: '#7A1B1B',
  },
  {
    name: 'blue' as ThemeType,
    color: '#1e40af',
  },
  { name: 'teal' as ThemeType, color: '#0f766e', fontFamily: 'Arial' },
  {
    name: 'purple' as ThemeType,
    color: '#6b21a8',
  },
];

export default themes;
