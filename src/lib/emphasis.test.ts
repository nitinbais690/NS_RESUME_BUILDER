import { describe, expect, it } from 'vitest';

import { splitEmphasis, splitSkillLabel, stripEmphasis } from './emphasis';

describe('splitEmphasis', () => {
  it('splits bold runs from plain text', () => {
    expect(splitEmphasis('Cut load time **by 40%** on launch')).toEqual([
      { text: 'Cut load time ', bold: false },
      { text: 'by 40%', bold: true },
      { text: ' on launch', bold: false },
    ]);
  });

  it('leaves unpaired asterisks as typed', () => {
    expect(splitEmphasis('5 * 3 **')).toEqual([{ text: '5 * 3 **', bold: false }]);
  });
});

describe('stripEmphasis', () => {
  it('removes the markers and keeps the text', () => {
    expect(stripEmphasis('Shipped **3 apps** in **2025**')).toBe('Shipped 3 apps in 2025');
  });
});

describe('splitSkillLabel', () => {
  it('reads a category prefix', () => {
    expect(splitSkillLabel('Mobile: React Native · Flutter')).toEqual({
      label: 'Mobile',
      items: 'React Native · Flutter',
    });
  });

  it('returns null for a plain skill or a URL-like value', () => {
    expect(splitSkillLabel('TypeScript')).toBeNull();
    expect(splitSkillLabel('https://example.com')).toBeNull();
  });
});
