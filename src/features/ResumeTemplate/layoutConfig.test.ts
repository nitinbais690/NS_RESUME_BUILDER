import { describe, expect, it } from 'vitest';

import { LAYOUT_CONFIG, layoutColumns, orderSections, sectionTitle } from './layoutConfig';
import { ResumeField } from '../../types';

describe('LAYOUT_CONFIG', () => {
  const content = Object.values(ResumeField).filter((f) => f !== ResumeField.CONTACT);

  it.each(Object.entries(LAYOUT_CONFIG))('%s places every section exactly once', (_, config) => {
    const placed = [...(config.left ?? []), ...(config.right ?? [])];
    expect([...placed].sort()).toEqual([...new Set(placed)].sort()); // no duplicates
    // Every section except ones a layout intentionally drops must appear.
    for (const field of content) {
      if (![ResumeField.KEY_IMPACT, ResumeField.TOOLS].includes(field)) expect(placed).toContain(field);
    }
  });
});

describe('section order and titles', () => {
  const { ABOUT_ME, EXPERIENCE, SKILLS, EDUCATION } = ResumeField;

  it('keeps the layout order when the user has none', () => {
    const fields = [ABOUT_ME, EXPERIENCE, SKILLS];
    expect(orderSections(fields, [])).toBe(fields);
  });

  it("follows the user's order, unplaced sections last in layout order", () => {
    expect(orderSections([ABOUT_ME, EXPERIENCE, SKILLS, EDUCATION], [SKILLS, ABOUT_ME])).toEqual([
      SKILLS,
      ABOUT_ME,
      EXPERIENCE,
      EDUCATION,
    ]);
  });

  it('keeps each section in its own column', () => {
    const { left, right } = layoutColumns('classic', [ResumeField.EXPERIENCE, ResumeField.EDUCATION]);
    expect(left[0]).toBe(ResumeField.EDUCATION);
    expect(right[0]).toBe(ResumeField.EXPERIENCE);
    expect(left).not.toContain(ResumeField.EXPERIENCE);
  });

  it("prefers the user's heading, then the layout's, then the field name", () => {
    const config = LAYOUT_CONFIG.ats;
    expect(sectionTitle(config, { sectionTitles: { [ABOUT_ME]: 'Profile' } }, ABOUT_ME)).toBe('Profile');
    expect(sectionTitle(config, { sectionTitles: { [ABOUT_ME]: '   ' } }, ABOUT_ME)).toBe('Summary');
    expect(sectionTitle(config, { sectionTitles: {} }, EXPERIENCE)).toBe('Experience');
  });
});
