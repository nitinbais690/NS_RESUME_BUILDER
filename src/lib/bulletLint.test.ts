import { describe, expect, it } from 'vitest';

import { lintBullet, lintLines, stripBulletMarker } from './bulletLint';

const codes = (text: string) => lintBullet(text).map((i) => i.code);

describe('lintBullet', () => {
  it('passes a strong, measurable bullet', () => {
    expect(codes('Cut app startup time by 40% by lazy-loading feature modules')).toEqual([]);
  });

  it('ignores empty rows', () => {
    expect(codes('   ')).toEqual([]);
  });

  it('flags weak openers and first person', () => {
    expect(codes('Responsible for the payments service used by 2M users')).toContain('weak-start');
    expect(codes('I built the payments service used by 2M users')).toContain('first-person');
  });

  it('flags bullets with no numbers, accepting words like "doubled"', () => {
    expect(codes('Built the new onboarding flow for the mobile app')).toContain('no-number');
    expect(codes('Doubled weekly active users with a redesigned onboarding flow')).not.toContain('no-number');
  });

  it('flags length problems', () => {
    expect(codes('Did 5 things')).toContain('too-short');
    expect(codes(`Built ${'a very long sentence '.repeat(12)} 10%`)).toContain('too-long');
  });
});

describe('lintLines', () => {
  it('reports only problem lines, with 1-based numbers and markers stripped', () => {
    const result = lintLines('• Grew revenue 20% with a new pricing page\n- Worked on the dashboard');
    expect(result).toHaveLength(1);
    expect(result[0].line).toBe(2);
    expect(result[0].text).toBe('Worked on the dashboard');
  });
});

describe('stripBulletMarker', () => {
  it('removes common markers', () => {
    expect(stripBulletMarker('  • Led team')).toBe('Led team');
    expect(stripBulletMarker('2) Led team')).toBe('Led team');
  });
});
