import { describe, expect, it } from 'vitest';
import { compareByRecency, formatRange, parseLegacyRange } from './dates';

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
