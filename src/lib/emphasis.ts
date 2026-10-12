export interface EmphasisPart {
  text: string;
  bold: boolean;
}

/**
 * Splits "Cut load time **by 40%** on launch" into plain and bold runs, so
 * people can bold the key result of a bullet with markdown-style asterisks.
 * Unpaired asterisks stay as typed.
 */
export const splitEmphasis = (text: string): EmphasisPart[] =>
  text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => ({ text: part, bold: i % 2 === 1 }))
    .filter((part) => part.text);

/** Text with the "**" markers removed, for places that can't render bold. */
export const stripEmphasis = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '$1');

/**
 * "Mobile: React Native · Flutter" → { label: "Mobile", items: "React Native · Flutter" }.
 * Lets a skill row carry its own category; returns null for a plain skill.
 */
export const splitSkillLabel = (skill: string) => {
  const match = /^([^:,]{1,40}):\s+(.+)$/.exec(skill.trim());
  return match ? { label: match[1].trim(), items: match[2].trim() } : null;
};
