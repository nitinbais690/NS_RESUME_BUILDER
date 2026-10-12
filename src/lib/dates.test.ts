import { describe, expect, it } from 'vitest';
import { compareByRecency, displayRange, formatRange, parseLegacyRange } from './dates';

describe('dates', () => {
  it('formats ranges', () => {
    expect(formatRange('2022-01', 'present')).toBe('Jan 2022 – Present');
    expect(formatRange('2019-06', '2021-12')).toBe('Jun 2019 – Dec 2021');
  });
  it('parses legacy text and rejects nonsense', () => {
    expect(parseLegacyRange('Jan 2022 – Present')).toEqual({ start: '2022-01', end: 'present' });
    expect(parseLegacyRange('2015 - 2019')).toEqual({ start: '2015-01', end: '2019-01' });
    expect(parseLegacyRange('sometime')).toEqual({});
  });
  it('sorts ongoing first, undated last', () => {
    const items = [{ start: '2019-01', end: '2020-01' }, {}, { start: '2021-01', end: 'present' }];
    expect([...items].sort(compareByRecency)).toEqual([items[2], items[0], items[1]]);
  });
});

describe('numeric dates', () => {
  it('formats a range as MM/YYYY', () => {
    expect(formatRange('2022-07', 'present', 'numeric')).toBe('07/2022 – Present');
  });

  it('re-derives structured entries and keeps free text as typed', () => {
    expect(displayRange({ date: 'Jul 2022 – Jul 2023', start: '2022-07', end: '2023-07' }, 'numeric')).toBe(
      '07/2022 – 07/2023',
    );
    expect(displayRange({ date: 'Summer 2020' }, 'numeric')).toBe('Summer 2020');
  });
});
