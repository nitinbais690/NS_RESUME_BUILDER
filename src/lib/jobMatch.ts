import { ContactInfo, ResumeData, ResumeField } from '../types';

// Common English + job-ad boilerplate that never makes a useful keyword.
const STOPWORDS = new Set(
  `a about above after again all also am an and any are as at be because been before being below between both but by can could did do does doing down during each etc few for from further had has have having he her here hers him his how i if in into is it its itself just me more most my no nor not now of off on once only or other our ours out over own same she should so some such than that the their them then there these they this those through to too under until up us very was we were what when where which while who whom why will with within without would you your yours
  ability able across advantage apply build building builds built collaborate collaborating create creating deliver delivering develop developing drive driving hire hiring improve improving lead leading maintain maintaining mentor mentoring own owning support supporting
  app apps engineer engineers engineering developer developers junior mid senior staff principal product products service services user users member members applicant applicants based benefits best candidate candidates company culture day days degree desired environment equal etc excellent experience experienced familiarity familiar great help ideal including job join key knowledge least looking make must new nice offer opportunity part plus preferred position professional proven role required requirements responsibilities responsible salary skills strong successful team teams understanding using well work working world year years`.split(
    /\s+/,
  ),
);

// Spellings that mean the same thing, mapped to one canonical form.
const ALIASES: Record<string, string> = {
  'react.js': 'react',
  reactjs: 'react',
  'node.js': 'node',
  nodejs: 'node',
  'vue.js': 'vue',
  vuejs: 'vue',
  'next.js': 'nextjs',
  js: 'javascript',
  ts: 'typescript',
  k8s: 'kubernetes',
  postgresql: 'postgres',
  'ci/cd': 'cicd',
  'ci-cd': 'cicd',
  golang: 'go',
};

const canon = (word: string) => ALIASES[word] ?? word;

const DISPLAY: Record<string, string> = { cicd: 'CI/CD', nextjs: 'Next.js', node: 'Node.js' };
/** Human-friendly spelling for a canonical term ("cicd" → "CI/CD"). */
export const displayTerm = (term: string) => DISPLAY[term] ?? term;

/** Lowercase tokens; keeps tech punctuation like c++, c#, .net, ci/cd, node.js. */
export const tokenize = (text: string): string[] =>
  (text
    .toLowerCase()
    .replace(/['’](re|s|ll|ve|d|m|t)\b/g, '') // we're → we, team's → team
    .match(/[a-z0-9][a-z0-9+#./-]*[a-z0-9+#]|[a-z0-9]/g) ?? [])
    .map((t) => t.replace(/[./-]+$/, ''))
    .map(canon);

const isCandidate = (t: string) => t.length > 1 && !STOPWORDS.has(t) && !/^\d+$/.test(t);

export interface Keyword {
  term: string;
  weight: number;
}

/**
 * Picks the terms a job ad cares about: repeated words and two-word phrases
 * ("react native", "system design"), with a boost for tech-looking tokens.
 */
export const extractKeywords = (jobText: string, limit = 25): Keyword[] => {
  const tokens = tokenize(jobText);
  const counts = new Map<string, number>();
  const bump = (term: string, by: number) => counts.set(term, (counts.get(term) ?? 0) + by);

  tokens.forEach((t, i) => {
    if (!isCandidate(t)) return;
    // Digits or symbols (c++, es6, ci/cd) or originally-capitalized words read as tech/tools.
    bump(t, /[0-9+#./]/.test(t) ? 1.5 : 1);
    const next = tokens[i + 1];
    if (next && isCandidate(next)) bump(`${t} ${next}`, 1.2);
  });

  // Boost words written with capitals in the ad (Kubernetes, GraphQL, AWS).
  for (const m of jobText.match(/\b[A-Z][A-Za-z0-9+#.]*[A-Za-z0-9+#]\b/g) ?? []) {
    const t = canon(m.toLowerCase());
    if (counts.has(t) && !STOPWORDS.has(t)) bump(t, 0.5);
  }

  const ranked = [...counts.entries()]
    // A phrase must repeat to count; single words need to appear once (tools are often listed once).
    .filter(([term, n]) => !term.includes(' ') || n >= 2.4)
    .sort((a, b) => b[1] - a[1]);

  // Single words that are part of a chosen phrase are redundant ("react" and
  // "native" when "react native" is in), so drop them.
  const phrases = ranked.filter(([term]) => term.includes(' ')).map(([term]) => term);
  const inPhrase = new Set(phrases.flatMap((p) => p.split(' ')));
  return ranked
    .filter(([term]) => term.includes(' ') || !inPhrase.has(term))
    .slice(0, limit)
    .map(([term, weight]) => ({ term, weight: Math.round(weight * 10) / 10 }));
};

/** All resume text in one searchable string. */
export const resumeText = (data: ResumeData): string => {
  const c = data[ResumeField.CONTACT];
  return [
    c[ContactInfo.POSITION],
    data[ResumeField.ABOUT_ME],
    ...data[ResumeField.KEY_IMPACT],
    ...data[ResumeField.SKILLS],
    ...data[ResumeField.TOOLS],
    ...data[ResumeField.EXPERIENCE].flatMap((e) => [e.title, e.company, e.desc, ...e.technologies]),
    ...data[ResumeField.PROJECTS].flatMap((p) => [p.name, p.desc, ...p.technologies]),
    ...data[ResumeField.EDUCATION].flatMap((e) => [e.degree, e.school]),
    ...data[ResumeField.CERTIFICATIONS].flatMap((x) => [x.name, x.issuer]),
    ...data[ResumeField.LANGUAGES].map((l) => l.name),
    ...data[ResumeField.AWARDS].flatMap((a) => [a.title, a.issuer, a.desc]),
    ...data[ResumeField.VOLUNTEERING].flatMap((v) => [v.role, v.org, v.desc]),
  ].join('\n');
};

export interface MatchResult {
  /** 0–100, weighted by how much the ad emphasizes each keyword. */
  score: number;
  matched: Keyword[];
  missing: Keyword[];
  suggestions: string[];
}

export const matchJob = (jobText: string, data: ResumeData): MatchResult => {
  const keywords = extractKeywords(jobText);
  if (keywords.length === 0) return { score: 0, matched: [], missing: [], suggestions: [] };

  const have = ` ${tokenize(resumeText(data)).join(' ')} `;
  const contains = (term: string) => have.includes(` ${term} `);

  const matched = keywords.filter((k) => contains(k.term));
  const missing = keywords.filter((k) => !contains(k.term));
  const total = keywords.reduce((s, k) => s + k.weight, 0);
  const got = matched.reduce((s, k) => s + k.weight, 0);
  const score = Math.round((got / total) * 100);

  const suggestions: string[] = [];
  const top = missing.slice(0, 3).map((k) => `"${k.term}"`);
  if (top.length) {
    suggestions.push(
      `The ad stresses ${top.join(', ')}. If you've used them, name them in a bullet that shows the result, not just in Skills.`,
    );
  }
  const position = data[ResumeField.CONTACT][ContactInfo.POSITION].toLowerCase();
  const firstLine = jobText.split('\n').find((l) => l.trim())?.trim() ?? '';
  if (firstLine && firstLine.length < 80 && position && !firstLine.toLowerCase().includes(position)) {
    suggestions.push(`Consider matching your headline to the role title: "${firstLine}".`);
  }
  if (score < 50) {
    suggestions.push('Duplicate this resume (resume menu → Duplicate) and tailor the copy for this job.');
  }
  suggestions.push("Only add keywords for things you've actually done. Recruiters ask about them.");

  return { score, matched, missing, suggestions };
};
