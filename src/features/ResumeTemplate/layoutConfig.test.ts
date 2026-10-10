import { describe, expect, it } from 'vitest';

import { LAYOUT_CONFIG } from './layoutConfig';
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
