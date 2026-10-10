import {
  ContactInfo,
  FontFamily,
  LayoutType,
  QrTarget,
  ResumeData,
  ResumeField,
  ResumeStyle,
  SavedResume,
  ThemeType,
} from '../types';
import { DEFAULT_STYLE, createEmptyResumeData } from '../constants/factories';
import { fontFamilies, layouts } from '../constants/themes';

/** File format marker so we can reject random JSON and migrate later. */
export const FILE_APP = 'ns-studio-resume';
export const FILE_VERSION = 1;

const THEMES: ThemeType[] = ['default', 'blue', 'teal', 'purple'];
const HEX = /^#[0-9a-f]{6}$/i;

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
const list = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);
const id = (v: unknown) => str(v) || crypto.randomUUID();

/**
 * Coerces untrusted input (an imported file, a share link) into a valid
 * ResumeData. Unknown keys are dropped, wrong types become empty values, and
 * missing ids are generated, so a hand-edited or older file still loads.
 */
export const normalizeResumeData = (input: unknown): ResumeData => {
  const empty = createEmptyResumeData();
  if (!isObj(input)) return empty;

  const c = isObj(input[ResumeField.CONTACT]) ? input[ResumeField.CONTACT] : {};
  const contact = { ...empty[ResumeField.CONTACT] };
  for (const key of Object.values(ContactInfo)) contact[key] = str(c[key]);

  return {
    [ResumeField.CONTACT]: contact,
    [ResumeField.ABOUT_ME]: str(input[ResumeField.ABOUT_ME]),
    [ResumeField.KEY_IMPACT]: strList(input[ResumeField.KEY_IMPACT]),
    [ResumeField.SKILLS]: strList(input[ResumeField.SKILLS]),
    [ResumeField.TOOLS]: strList(input[ResumeField.TOOLS]),
    [ResumeField.EDUCATION]: list(input[ResumeField.EDUCATION]).map((e) => ({
      id: id(e.id),
      degree: str(e.degree),
      school: str(e.school),
      year: str(e.year),
      score: str(e.score),
    })),
    [ResumeField.EXPERIENCE]: list(input[ResumeField.EXPERIENCE]).map((e) => ({
      id: id(e.id),
      title: str(e.title),
      company: str(e.company),
      date: str(e.date),
      desc: str(e.desc),
      technologies: strList(e.technologies),
    })),
    [ResumeField.PROJECTS]: list(input[ResumeField.PROJECTS]).map((p) => ({
      id: id(p.id),
      name: str(p.name),
      link: str(p.link),
      desc: str(p.desc),
      technologies: strList(p.technologies),
    })),
    [ResumeField.CERTIFICATIONS]: list(input[ResumeField.CERTIFICATIONS]).map(
      (c) => ({
        id: id(c.id),
        name: str(c.name),
        issuer: str(c.issuer),
        date: str(c.date),
        link: str(c.link),
      }),
    ),
  };
};

export const normalizeStyle = (input: unknown): ResumeStyle => {
  if (!isObj(input)) return { ...DEFAULT_STYLE };
  const scale = Number(input.fontScale);
  return {
    theme: THEMES.includes(input.theme as ThemeType)
      ? (input.theme as ThemeType)
      : DEFAULT_STYLE.theme,
    layout: layouts.includes(input.layout as LayoutType)
      ? (input.layout as LayoutType)
      : DEFAULT_STYLE.layout,
    fontFamily: fontFamilies.includes(input.fontFamily as FontFamily)
      ? (input.fontFamily as FontFamily)
      : DEFAULT_STYLE.fontFamily,
    accentColor:
      typeof input.accentColor === 'string' && HEX.test(input.accentColor)
        ? input.accentColor
        : null,
    fontScale: Number.isFinite(scale)
      ? Math.min(Math.max(scale, 0.8), 1.25)
      : 1,
    qrTarget: ['linkedin', 'github'].includes(input.qrTarget as QrTarget)
      ? (input.qrTarget as QrTarget)
      : 'none',
  };
};

export interface ResumeFile {
  app: typeof FILE_APP;
  version: number;
  name: string;
  style: ResumeStyle;
  data: ResumeData;
}

export const toResumeFile = (resume: SavedResume): ResumeFile => ({
  app: FILE_APP,
  version: FILE_VERSION,
  name: resume.name,
  style: resume.style,
  data: resume.data,
});

/**
 * Parses an exported .json file. Throws a user-readable Error for anything that
 * isn't one of our files; otherwise returns normalized content.
 */
export const parseResumeFile = (
  text: string,
): Pick<SavedResume, 'name' | 'data' | 'style'> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  if (!isObj(parsed) || parsed.app !== FILE_APP) {
    throw new Error('That file was not exported from NS Studio.');
  }
  if (typeof parsed.version !== 'number' || parsed.version > FILE_VERSION) {
    throw new Error('That file is from a newer version of NS Studio.');
  }
  return {
    name: str(parsed.name).trim() || 'Imported resume',
    data: normalizeResumeData(parsed.data),
    style: normalizeStyle(parsed.style),
  };
};

/** Safe-ish file name from a resume name: "Mobile Lead" → "mobile-lead". */
export const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'resume';

export const downloadText = (filename: string, text: string, type: string) => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
