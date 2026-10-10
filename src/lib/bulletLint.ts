export type BulletIssueCode =
  | 'no-number'
  | 'weak-start'
  | 'first-person'
  | 'too-long'
  | 'too-short';

export interface BulletIssue {
  code: BulletIssueCode;
  message: string;
}

const WEAK_STARTS = [
  'responsible for',
  'worked on',
  'working on',
  'helped',
  'helping',
  'assisted',
  'assisting',
  'involved in',
  'tasked with',
  'duties included',
  'participated in',
  'in charge of',
  'handled',
];

const FIRST_PERSON = /^(i|i'm|i've|my|we|our|me)\b/i;
// Digits cover %, $, 10x, 2M, 99.9; the words cover "doubled", "halved", etc.
const HAS_NUMBER = /\d|\b(doubled|tripled|halved|quadrupled|twice|half)\b/i;

export const MAX_BULLET_CHARS = 180;
const MIN_BULLET_CHARS = 25;

/** Strips list markers people type or paste: "•", "-", "*", "1.", "2)". */
export const stripBulletMarker = (line: string) =>
  line.replace(/^\s*(?:[•\-–*·▪]|\d+[.)])\s*/, '').trim();

/**
 * Checks one resume bullet for the usual weaknesses. Returns [] for a strong
 * bullet or an empty line (empty rows are just unfinished, not wrong).
 */
export const lintBullet = (raw: string): BulletIssue[] => {
  const text = stripBulletMarker(raw);
  if (!text) return [];
  const lower = text.toLowerCase();
  const issues: BulletIssue[] = [];

  const weak = WEAK_STARTS.find((w) => lower.startsWith(w));
  if (weak) {
    issues.push({
      code: 'weak-start',
      message: `"${text.slice(0, weak.length)}…" sounds passive. Start with what you did: Led, Built, Cut, Shipped, Grew.`,
    });
  } else if (FIRST_PERSON.test(text)) {
    issues.push({
      code: 'first-person',
      message: 'Drop "I/we" and start with the action verb.',
    });
  }

  if (!HAS_NUMBER.test(text)) {
    issues.push({
      code: 'no-number',
      message: 'Add a number: %, time saved, users, revenue, team size.',
    });
  }

  if (text.length > MAX_BULLET_CHARS) {
    issues.push({
      code: 'too-long',
      message: `${text.length} characters. Aim for under ${MAX_BULLET_CHARS} (about 25 words).`,
    });
  } else if (text.length < MIN_BULLET_CHARS) {
    issues.push({
      code: 'too-short',
      message: 'Too brief. Say what changed and the result.',
    });
  }

  return issues;
};

/** Lints each line of a multi-line description; returns only lines with issues. */
export const lintLines = (text: string) =>
  text
    .split('\n')
    .map((line, i) => ({ line: i + 1, text: stripBulletMarker(line), issues: lintBullet(line) }))
    .filter((l) => l.issues.length > 0);
