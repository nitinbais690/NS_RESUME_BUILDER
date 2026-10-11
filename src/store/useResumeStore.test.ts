import { beforeEach, describe, expect, it } from 'vitest';

import { moveItem, useResumeStore } from './useResumeStore';
import { ResumeField } from '../types';
import { DEFAULT_STYLE, createExperience } from '../constants/factories';

const store = () => useResumeStore.getState();

beforeEach(() => {
  localStorage.clear();
  useResumeStore.setState(useResumeStore.getInitialState(), true);
});

describe('moveItem', () => {
  it('moves an item forward and backward', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
    expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
  });

  it('returns the same array for no-op or out-of-range moves', () => {
    const items = ['a', 'b'];
    expect(moveItem(items, 1, 1)).toBe(items);
    expect(moveItem(items, 0, 5)).toBe(items);
    expect(moveItem(items, -1, 0)).toBe(items);
  });
});

describe('editing and history', () => {
  it('updates list fields and supports undo/redo', () => {
    store().updateListField(ResumeField.KEY_IMPACT, ['One']);
    expect(store().resumeData[ResumeField.KEY_IMPACT]).toEqual(['One']);

    store().undo();
    expect(store().resumeData[ResumeField.KEY_IMPACT]).not.toEqual(['One']);

    store().redo();
    expect(store().resumeData[ResumeField.KEY_IMPACT]).toEqual(['One']);
  });

  it('reorders entities and records it in history', () => {
    const before = store().resumeData[ResumeField.EXPERIENCE].map((e) => e.id);
    store().reorder(ResumeField.EXPERIENCE, 0, 1);
    const after = store().resumeData[ResumeField.EXPERIENCE].map((e) => e.id);
    expect(after).toEqual([before[1], before[0], ...before.slice(2)]);

    store().undo();
    expect(store().resumeData[ResumeField.EXPERIENCE].map((e) => e.id)).toEqual(before);
  });

  it('ignores a no-op reorder (no history entry)', () => {
    store().reorder(ResumeField.SKILLS, 0, 0);
    expect(store()._past).toHaveLength(0);
  });

  it('adds, updates and removes entities', () => {
    const exp = createExperience();
    store().addExperience(exp);
    store().updateExperience(exp.id, { title: 'Lead' });
    expect(store().resumeData[ResumeField.EXPERIENCE].at(-1)?.title).toBe('Lead');
    store().removeExperience(exp.id);
    expect(store().resumeData[ResumeField.EXPERIENCE].some((e) => e.id === exp.id)).toBe(false);
  });

  it('clamps spacing scale to 70–140%', () => {
    store().setSpacingScale(5);
    expect(store().spacingScale).toBe(1.4);
    store().setSpacingScale(0.1);
    expect(store().spacingScale).toBe(0.7);
  });

  it('clamps font scale and clears the custom accent when a theme is picked', () => {
    store().setFontScale(3);
    expect(store().fontScale).toBe(1.25);
    store().setAccentColor('#123456');
    store().setTheme('blue');
    expect(store().accentColor).toBeNull();
  });
});

describe('multiple resumes', () => {
  it('creates a blank resume, switches, and keeps the original intact', () => {
    const firstId = store().activeResumeId;
    store().updateAboutMe('Original summary');

    const newId = store().createResume('Frontend', 'blank');
    expect(store().activeResumeId).toBe(newId);
    expect(store().resumeData[ResumeField.ABOUT_ME]).toBe('');
    expect(store().resumes[newId].name).toBe('Frontend');

    store().updateAboutMe('Frontend summary');
    store().switchResume(firstId);
    expect(store().resumeData[ResumeField.ABOUT_ME]).toBe('Original summary');

    store().switchResume(newId);
    expect(store().resumeData[ResumeField.ABOUT_ME]).toBe('Frontend summary');
  });

  it('duplicates content and style, but as an independent copy', () => {
    store().setLayout('modern');
    store().updateListField(ResumeField.SKILLS, ['Go']);
    store().createResume('Copy', 'duplicate');

    expect(store().layout).toBe('modern');
    expect(store().resumeData[ResumeField.SKILLS]).toEqual(['Go']);

    store().updateListField(ResumeField.SKILLS, ['Rust']);
    const original = Object.values(store().resumes).find((r) => r.name === 'My Resume')!;
    expect(original.data[ResumeField.SKILLS]).toEqual(['Go']);
  });

  it('clears undo history when switching resumes', () => {
    store().updateAboutMe('x');
    store().createResume('Other', 'blank');
    expect(store()._past).toHaveLength(0);
  });

  it('saves a style as a template and applies it to another resume', () => {
    store().setLayout('tech');
    store().setFontScale(0.9);
    const id = store().saveTemplate('  Dense tech  ');
    expect(store().customTemplates).toEqual([
      expect.objectContaining({ id, name: 'Dense tech' }),
    ]);

    store().createResume('B', 'blank');
    expect(store().layout).toBe(DEFAULT_STYLE.layout);
    store().applyTemplate(id);
    expect(store().layout).toBe('tech');
    expect(store().fontScale).toBe(0.9);

    store().deleteTemplate(id);
    expect(store().customTemplates).toEqual([]);
  });

  it('sets, clamps and resets section spacing', () => {
    store().setGap('section', 0.5);
    store().setGap('entry', 7);
    expect(store().gaps).toEqual({ section: 0.5, heading: 1, entry: 2 });
    store().resetGaps();
    expect(store().gaps).toEqual(DEFAULT_STYLE.gaps);
  });

  it('keeps style per resume', () => {
    const firstId = store().activeResumeId;
    store().setLayout('executive');
    store().createResume('B', 'blank');
    expect(store().layout).toBe(DEFAULT_STYLE.layout);
    store().switchResume(firstId);
    expect(store().layout).toBe('executive');
  });

  it('renames, rejecting empty names', () => {
    const id = store().activeResumeId;
    store().renameResume(id, '  Mobile Lead ');
    expect(store().resumes[id].name).toBe('Mobile Lead');
    store().renameResume(id, '   ');
    expect(store().resumes[id].name).toBe('Mobile Lead');
  });

  it('never deletes the last resume, and falls back when deleting the active one', () => {
    const firstId = store().activeResumeId;
    store().deleteResume(firstId);
    expect(store().resumes[firstId]).toBeDefined();

    const secondId = store().createResume('Second', 'blank');
    store().deleteResume(secondId);
    expect(store().resumes[secondId]).toBeUndefined();
    expect(store().activeResumeId).toBe(firstId);
  });

  it('imports a resume as a new active version', () => {
    const before = Object.keys(store().resumes).length;
    const { resumeData, ...rest } = store();
    store().importResume({
      name: 'Imported',
      data: { ...resumeData, [ResumeField.ABOUT_ME]: 'From file' },
      style: { ...rest, layout: 'ats' },
    });
    expect(Object.keys(store().resumes)).toHaveLength(before + 1);
    expect(store().resumeData[ResumeField.ABOUT_ME]).toBe('From file');
    expect(store().layout).toBe('ats');
  });

  it('getActiveResume reflects unsaved edits', () => {
    store().updateAboutMe('Live edit');
    expect(store().getActiveResume().data[ResumeField.ABOUT_ME]).toBe('Live edit');
  });
});

describe('persistence', () => {
  it('migrates a v0 single-resume save into the resumes map', async () => {
    localStorage.setItem(
      'ns_cv_resume_data',
      JSON.stringify({
        version: 0,
        state: {
          resumeData: { [ResumeField.ABOUT_ME]: 'Old save', [ResumeField.SKILLS]: ['A'] },
          theme: 'teal',
          layout: 'modern',
          fontFamily: 'Arial',
          colorScheme: 'dark',
        },
      }),
    );
    await useResumeStore.persist.rehydrate();

    const s = store();
    expect(s.resumeData[ResumeField.ABOUT_ME]).toBe('Old save');
    expect(s.resumeData[ResumeField.EXPERIENCE]).toEqual([]); // filled in
    expect(s.theme).toBe('teal');
    expect(s.colorScheme).toBe('dark');
    expect(Object.values(s.resumes)).toHaveLength(1);
    expect(s.resumes[s.activeResumeId].data[ResumeField.ABOUT_ME]).toBe('Old save');
  });

  it('repairs corrupted saved data instead of crashing', async () => {
    localStorage.setItem(
      'ns_cv_resume_data',
      JSON.stringify({
        version: 1,
        state: {
          resumeData: null,
          layout: 'not-a-layout',
          fontScale: 'huge',
          activeResumeId: 'gone',
          resumes: { broken: null, ok: { name: '', data: { [ResumeField.SKILLS]: ['Go', 3] } } },
        },
      }),
    );
    await useResumeStore.persist.rehydrate();

    const s = store();
    // null resumeData falls back to a complete resume instead of crashing.
    expect(Array.isArray(s.resumeData[ResumeField.EXPERIENCE])).toBe(true);
    expect(typeof s.resumeData[ResumeField.ABOUT_ME]).toBe('string');
    expect(s.layout).toBe(DEFAULT_STYLE.layout);
    expect(s.fontScale).toBe(1);
    expect(s.resumes.broken).toBeUndefined();
    expect(s.resumes.ok.name).toBe('Untitled resume');
    expect(s.resumes.ok.data[ResumeField.SKILLS]).toEqual(['Go']);
    // The active id pointed nowhere, so an entry is recreated for it.
    expect(s.resumes[s.activeResumeId]).toBeDefined();
  });
});
