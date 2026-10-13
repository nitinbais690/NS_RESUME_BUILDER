import {
  ContactInfo,
  FontFamily,
  LayoutType,
  QrTarget,
  ResumeData,
  ResumeField,
  ResumeStyle,
  SavedResume,
  SpacingGaps,
  ThemeType,
} from '../types';
import { DEFAULT_STYLE, createEmptyResumeData } from '../constants/factories';
import { LEGACY_LAYOUTS, fontFamilies, layouts } from '../constants/themes';
import { PRESENT, formatRange, isMonth, parseLegacyRange } from './dates';
import { LanguageLevel } from '../types';

const LEVELS: LanguageLevel[] = ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'];

/**
 * Structured dates for a ranged entry. Valid start/end are kept; otherwise we
 * try to parse the legacy free-text `date` ("Jan 2022 – Present"). The display
 * string is re-derived when structured dates exist, else the text is kept.
 */
const dateRange = (e: Obj) => {
  let start = isMonth(e.start) ? e.start : undefined;
  let end = isMonth(e.end) || e.end === PRESENT ? (e.end as string) : undefined;
  if (!start && !end) ({ start, end } = parseLegacyRange(str(e.date)));
  const range: { date: string; start?: string; end?: string } = {
    date: start ? formatRange(start, end) : str(e.date),
  };
  if (start) range.start = start;
  if (end) range.end = end;
  return range;
};

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
      ...dateRange(e),
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
        desc: str(c.desc),
      }),
    ),
    [ResumeField.LANGUAGES]: list(input[ResumeField.LANGUAGES]).map((l) => ({
      id: id(l.id),
      name: str(l.name),
      level: LEVELS.includes(l.level as LanguageLevel) ? (l.level as LanguageLevel) : 'Professional',
    })),
    [ResumeField.AWARDS]: list(input[ResumeField.AWARDS]).map((a) => ({
      id: id(a.id),
      title: str(a.title),
      issuer: str(a.issuer),
      date: str(a.date),
      desc: str(a.desc),
    })),
    [ResumeField.VOLUNTEERING]: list(input[ResumeField.VOLUNTEERING]).map((v) => ({
      id: id(v.id),
      role: str(v.role),
      org: str(v.org),
      ...dateRange(v),
      desc: str(v.desc),
    })),
  };
};

export const GAP_MIN = 0;
export const GAP_MAX = 2;

/** Clamps one gap multiplier; anything unusable falls back to 1 (layout default). */
export const clampGap = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(Math.min(Math.max(n, GAP_MIN), GAP_MAX) * 100) / 100 : 1;
};

const normalizeGaps = (input: unknown): SpacingGaps => {
  const g = isObj(input) ? input : {};
  return { section: clampGap(g.section), heading: clampGap(g.heading), entry: clampGap(g.entry) };
};

const isField = (f: unknown): f is ResumeField =>
  (Object.values(ResumeField) as unknown[]).includes(f);

/** Longest heading the user can type for a section. */
export const SECTION_TITLE_MAX = 40;

const normalizeTitles = (input: unknown): ResumeStyle['sectionTitles'] => {
  const out: ResumeStyle['sectionTitles'] = {};
  if (!isObj(input)) return out;
  for (const [field, title] of Object.entries(input)) {
    const t = str(title).trim().slice(0, SECTION_TITLE_MAX);
    if (isField(field) && t) out[field] = t;
  }
  return out;
};

export const normalizeStyle = (input: unknown): ResumeStyle => {
  if (!isObj(input)) return { ...DEFAULT_STYLE };
  const scale = Number(input.fontScale);
  const spacing = Number(input.spacingScale);
  return {
    theme: THEMES.includes(input.theme as ThemeType)
      ? (input.theme as ThemeType)
      : DEFAULT_STYLE.theme,
    layout: layouts.includes(input.layout as LayoutType)
      ? (input.layout as LayoutType)
      : (LEGACY_LAYOUTS[str(input.layout)] ?? DEFAULT_STYLE.layout),
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
    spacingScale: Number.isFinite(spacing) ? Math.min(Math.max(spacing, 0.7), 1.4) : 1,
    gaps: normalizeGaps(input.gaps),
    qrTarget: ['linkedin', 'github'].includes(input.qrTarget as QrTarget)
      ? (input.qrTarget as QrTarget)
      : 'none',
    hiddenSections: Array.isArray(input.hiddenSections)
      ? [...new Set(input.hiddenSections)].filter(
          (f): f is ResumeField => isField(f) && f !== ResumeField.CONTACT,
        )
      : [],
    dateFormat: input.dateFormat === 'numeric' ? 'numeric' : 'short',
    sectionOrder: Array.isArray(input.sectionOrder)
      ? [...new Set(input.sectionOrder)].filter(isField)
      : [],
    sectionTitles: normalizeTitles(input.sectionTitles),
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

/** True when an object carries at least one resume section key ("Contact", "Experience"…). */
const looksLikeResumeData = (v: Obj) =>
  Object.values(ResumeField).some((field) => field in v);

/** Parsed import. `style` is only set when the file carries one. */
export type ParsedResumeFile = Pick<SavedResume, 'name' | 'data'> & { style?: ResumeStyle };

/**
 * Parses an exported .json file. Also accepts a bare resume-data object (just
 * the `data` part), which is what people tend to write by hand. Throws a
 * user-readable Error for anything else; otherwise returns normalized content.
 * Files without a `style` leave it unset, so the importer keeps the template
 * the user already picked instead of resetting to the default.
 */
export const parseResumeFile = (text: string): ParsedResumeFile => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON. Check for missing commas or quotes.');
  }
  if (isObj(parsed) && parsed.app !== FILE_APP && looksLikeResumeData(parsed)) {
    return { name: 'Imported resume', data: normalizeResumeData(parsed) };
  }
  if (!isObj(parsed) || parsed.app !== FILE_APP) {
    throw new Error(
      "That file doesn't look like a resume. Download the sample file to see the expected format.",
    );
  }
  if (typeof parsed.version !== 'number' || parsed.version > FILE_VERSION) {
    throw new Error('That file is from a newer version of NS Studio.');
  }
  return {
    name: str(parsed.name).trim() || 'Imported resume',
    data: normalizeResumeData(parsed.data),
    ...(isObj(parsed.style) ? { style: normalizeStyle(parsed.style) } : {}),
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
