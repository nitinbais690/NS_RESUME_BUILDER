import { describe, expect, it } from 'vitest';

import {
  FILE_APP,
  normalizeResumeData,
  normalizeStyle,
  parseResumeFile,
  slugify,
  toResumeFile,
} from './resumeIO';
import { buildShareUrl, parseShareHash } from './share';
import { ResumeField } from '../types';
import dummyResumeData from '../data';
import { DEFAULT_STYLE } from '../constants/factories';

describe('normalizeResumeData', () => {
  it('fills every field for garbage input', () => {
    const data = normalizeResumeData('nope');
    expect(data[ResumeField.EXPERIENCE]).toEqual([]);
    expect(data[ResumeField.CONTACT].Name).toBe('');
  });

  it('drops wrong types and generates missing ids', () => {
    const data = normalizeResumeData({
      [ResumeField.SKILLS]: ['TS', 42, null],
      [ResumeField.EXPERIENCE]: [{ title: 'Dev', technologies: 'x' }, 'bad'],
    });
    expect(data[ResumeField.SKILLS]).toEqual(['TS']);
    expect(data[ResumeField.EXPERIENCE]).toHaveLength(1);
    expect(data[ResumeField.EXPERIENCE][0].id).toBeTruthy();
    expect(data[ResumeField.EXPERIENCE][0].technologies).toEqual([]);
  });

  it('round-trips real data unchanged', () => {
    expect(normalizeResumeData(dummyResumeData)).toEqual(
      normalizeResumeData(JSON.parse(JSON.stringify(dummyResumeData))),
    );
  });
});

describe('normalizeStyle', () => {
  it('falls back to defaults for invalid values', () => {
    expect(
      normalizeStyle({ theme: 'pink', layout: 'x', accentColor: 'red', fontScale: 'big' }),
    ).toEqual(DEFAULT_STYLE);
  });

  it('clamps section spacing gaps and defaults missing ones to 1', () => {
    expect(normalizeStyle({ gaps: { section: 9, heading: -1, entry: 'x' } }).gaps).toEqual({
      section: 2,
      heading: 0,
      entry: 1,
    });
    expect(normalizeStyle({}).gaps).toEqual({ section: 1, heading: 1, entry: 1 });
  });

  it('maps removed layouts to their closest replacement', () => {
    expect(normalizeStyle({ layout: 'minimalist' }).layout).toBe('harvard');
    expect(normalizeStyle({ layout: 'creative' }).layout).toBe('classic');
  });

  it('keeps valid values and clamps the scale', () => {
    const style = normalizeStyle({ layout: 'ats', accentColor: '#AA00ff', fontScale: 9 });
    expect(style.layout).toBe('ats');
    expect(style.accentColor).toBe('#AA00ff');
    expect(style.fontScale).toBe(1.25);
  });
});

describe('parseResumeFile', () => {
  const file = toResumeFile({
    id: '1',
    name: 'Mobile Lead',
    updatedAt: 0,
    data: dummyResumeData,
    style: DEFAULT_STYLE,
  });

  it('parses an exported file', () => {
    const parsed = parseResumeFile(JSON.stringify(file));
    expect(parsed.name).toBe('Mobile Lead');
    expect(parsed.data[ResumeField.ABOUT_ME]).toBe(dummyResumeData[ResumeField.ABOUT_ME]);
  });

  it('accepts bare resume data written by hand', () => {
    const parsed = parseResumeFile(
      JSON.stringify({ Contact: { Name: 'Priya' }, Skills: ['Go', 7] }),
    );
    expect(parsed.name).toBe('Imported resume');
    expect(parsed.data[ResumeField.CONTACT].Name).toBe('Priya');
    expect(parsed.data[ResumeField.SKILLS]).toEqual(['Go']);
    expect(parsed.style).toEqual(DEFAULT_STYLE);
  });

  it('rejects invalid JSON, foreign files and newer versions with readable errors', () => {
    expect(() => parseResumeFile('{')).toThrow(/not valid JSON/);
    expect(() => parseResumeFile('{"hello":1}')).toThrow(/doesn't look like a resume/);
    expect(() =>
      parseResumeFile(JSON.stringify({ ...file, app: FILE_APP, version: 99 })),
    ).toThrow(/newer version/);
  });
});

describe('share links', () => {
  it('round-trips content and style through the hash', () => {
    const url = buildShareUrl(
      { data: dummyResumeData, style: { ...DEFAULT_STYLE, layout: 'modern' } },
      'https://example.com',
    );
    expect(url.startsWith('https://example.com/view#')).toBe(true);

    const shared = parseShareHash(new URL(url).hash);
    expect(shared?.style.layout).toBe('modern');
    expect(shared?.data[ResumeField.KEY_IMPACT]).toEqual(dummyResumeData[ResumeField.KEY_IMPACT]);
  });

  it('returns null for empty or corrupted hashes', () => {
    expect(parseShareHash('')).toBeNull();
    expect(parseShareHash('#not-a-real-payload')).toBeNull();
  });
});

describe('slugify', () => {
  it('makes file-safe names', () => {
    expect(slugify('Mobile Lead (2026)!')).toBe('mobile-lead-2026');
    expect(slugify('***')).toBe('resume');
  });
});
