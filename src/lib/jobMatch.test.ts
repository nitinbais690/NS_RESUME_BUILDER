import { describe, expect, it } from 'vitest';

import { extractKeywords, matchJob, tokenize } from './jobMatch';
import { getChecklist, scoreOf } from './completeness';
import dummyResumeData from '../data';
import { createEmptyResumeData } from '../constants/factories';
import { ResumeField } from '../types';

const JD = `Senior React Native Engineer
We are looking for a React Native engineer with strong TypeScript skills.
You will build React Native apps, own CI/CD pipelines and work with GraphQL.
Experience with Kubernetes and GraphQL is a plus. TypeScript is required.`;

describe('tokenize', () => {
  it('keeps tech punctuation and maps aliases', () => {
    expect(tokenize('Node.js, C++, CI/CD and ReactJS.')).toEqual(['node', 'c++', 'cicd', 'and', 'react']);
  });
});

describe('extractKeywords', () => {
  it('finds repeated phrases and tools, skipping boilerplate', () => {
    const terms = extractKeywords(JD).map((k) => k.term);
    expect(terms).toContain('react native');
    expect(terms).toContain('typescript');
    expect(terms).toContain('graphql');
    expect(terms).not.toContain('looking');
    expect(terms).not.toContain('required');
    // Parts of a picked phrase aren't repeated on their own.
    expect(terms).not.toContain('native');
  });

  it("ignores contractions and generic job-ad verbs", () => {
    const terms = extractKeywords("We're hiring. You'll build apps and mentor engineers using Kotlin.").map((k) => k.term);
    expect(terms).toEqual(['kotlin']);
  });

  it('returns nothing for empty input', () => {
    expect(extractKeywords('   ')).toEqual([]);
  });
});

describe('matchJob', () => {
  it('scores matches and lists missing keywords', () => {
    const result = matchJob(JD, dummyResumeData);
    const matched = result.matched.map((k) => k.term);
    const missing = result.missing.map((k) => k.term);
    expect(matched).toContain('react native');
    expect(matched).toContain('typescript');
    expect(missing).toContain('graphql');
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(100);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it('scores an empty resume at 0', () => {
    expect(matchJob(JD, createEmptyResumeData()).score).toBe(0);
  });
});

describe('completeness checklist', () => {
  it('totals 100 points and scores an empty resume at 0', () => {
    const items = getChecklist(createEmptyResumeData());
    expect(items.reduce((s, i) => s + i.points, 0)).toBe(100);
    expect(scoreOf(items)).toBe(0);
  });

  it('phrases remaining work concretely', () => {
    const data = createEmptyResumeData();
    data[ResumeField.SKILLS] = ['Go', 'Rust'];
    const skills = getChecklist(data).find((i) => i.id === 'skills')!;
    expect(skills.label).toBe('Add 1 more skill');
    expect(skills.done).toBe(false);
  });

  it('gives the sample resume a high score', () => {
    expect(scoreOf(getChecklist(dummyResumeData))).toBeGreaterThanOrEqual(90);
  });
});

describe('getPageFit', () => {
  it('treats an exact or slightly-over A4 sheet as one page', async () => {
    const { getPageFit, A4_HEIGHT_PX } = await import('./pageFit');
    expect(getPageFit(A4_HEIGHT_PX).fitsOnePage).toBe(true);
    expect(getPageFit(A4_HEIGHT_PX + 3).fitsOnePage).toBe(true);
  });

  it('reports pages and overflow when content runs long', async () => {
    const { getPageFit, A4_HEIGHT_PX } = await import('./pageFit');
    const fit = getPageFit(A4_HEIGHT_PX * 1.25 + 6);
    expect(fit.pages).toBe(2);
    expect(fit.overflow).toBeCloseTo(0.25, 2);
  });
});
