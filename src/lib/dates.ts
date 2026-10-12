import type { DateFormat } from '../types';

/**
 * Month-precision dates for experience/volunteering. Stored as "YYYY-MM" (what
 * <input type="month"> produces); an end of "present" means ongoing.
 */
export const PRESENT = 'present';
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const isMonth = (v: unknown): v is string => typeof v === 'string' && MONTH_RE.test(v);

/**
 * "2022-01" → "Jan 2022" (or "01/2022" when numeric); "present" → "Present";
 * anything else → "".
 */
export const formatMonth = (v?: string, format: DateFormat = 'short') => {
  if (v === PRESENT) return 'Present';
  if (!isMonth(v)) return '';
  const [y, m] = v.split('-');
  return format === 'numeric' ? `${m}/${y}` : `${MONTHS[Number(m) - 1]} ${y}`;
};

/** Display string for a range, e.g. "Jan 2022 – Present". */
export const formatRange = (start?: string, end?: string, format: DateFormat = 'short') =>
  [formatMonth(start, format), formatMonth(end, format)].filter(Boolean).join(' – ');

/**
 * The date to print for a ranged entry: re-derived from start/end in the
 * chosen format, or the stored text for entries without structured dates.
 */
export const displayRange = (
  entry: { date: string; start?: string; end?: string },
  format: DateFormat = 'short',
) => (entry.start ? formatRange(entry.start, entry.end, format) : entry.date);

const monthIndex = (name: string) =>
  MONTHS.findIndex((m) => name.toLowerCase().startsWith(m.toLowerCase()));

/** Parses one side of a free-text range: "Jan 2022", "January 2022", "2022", "Present". */
const parseSide = (raw: string): string | undefined => {
  const t = raw.trim();
  if (/^(present|current|now|today)$/i.test(t)) return PRESENT;
  const monthYear = t.match(/^([A-Za-z]{3,9})\.?\s+(\d{4})$/);
  if (monthYear) {
    const m = monthIndex(monthYear[1]);
    if (m >= 0) return `${monthYear[2]}-${String(m + 1).padStart(2, '0')}`;
  }
  const numeric = t.match(/^(\d{1,2})[/.-](\d{4})$/);
  if (numeric && Number(numeric[1]) >= 1 && Number(numeric[1]) <= 12) {
    return `${numeric[2]}-${numeric[1].padStart(2, '0')}`;
  }
  // A bare year can't say which month, so January is the honest default.
  const year = t.match(/^(\d{4})$/);
  if (year) return `${year[1]}-01`;
  return undefined;
};

/**
 * Best-effort upgrade of legacy free-text dates ("Jan 2022 – Present") into
 * structured start/end. Returns {} when the text isn't recognizable, so the
 * original string is kept as-is.
 */
export const parseLegacyRange = (text: string): { start?: string; end?: string } => {
  const parts = text.split(/\s*(?:–|—|-|to)\s*/i).filter(Boolean);
  if (parts.length === 0 || parts.length > 2) return {};
  const start = parseSide(parts[0]);
  const end = parts[1] !== undefined ? parseSide(parts[1]) : undefined;
  if (!start || start === PRESENT) return {};
  if (parts[1] !== undefined && !end) return {};
  return end ? { start, end } : { start };
};

/** Sort key: ongoing first, then latest end, then latest start; undated last. */
export const compareByRecency = (
  a: { start?: string; end?: string },
  b: { start?: string; end?: string },
) => {
  const endKey = (x: { start?: string; end?: string }) =>
    x.end === PRESENT ? '9999-99' : x.end || x.start || '';
  return endKey(b).localeCompare(endKey(a)) || (b.start ?? '').localeCompare(a.start ?? '');
};
