import { ContactInfo, ResumeData, ResumeField } from '../types';

export interface ChecklistItem {
  id: string;
  /** What to do next, phrased for the current state ("Add 1 more skill"). */
  label: string;
  points: number;
  done: boolean;
  /** Form step id to open (matches FORM_STEPS ids). */
  step: string;
}

const more = (have: number, need: number, noun: string, plural = `${noun}s`) => {
  const left = need - have;
  return `Add ${left} more ${left === 1 ? noun : plural}`;
};

/**
 * Resume completeness as an actionable checklist. Points add up to 100; the
 * score is the sum of points for done items.
 */
export const getChecklist = (data: ResumeData): ChecklistItem[] => {
  const c = data[ResumeField.CONTACT];
  const impacts = data[ResumeField.KEY_IMPACT].filter((s) => s.trim()).length;
  const skills = data[ResumeField.SKILLS].filter((s) => s.trim()).length;
  const tools = data[ResumeField.TOOLS].filter((s) => s.trim()).length;
  const about = data[ResumeField.ABOUT_ME].trim().length;

  return [
    { id: 'name', label: 'Add your name', points: 5, done: !!c[ContactInfo.NAME]?.trim(), step: 'personal' },
    { id: 'position', label: 'Add your job title', points: 5, done: !!c[ContactInfo.POSITION]?.trim(), step: 'personal' },
    { id: 'email', label: 'Add your email', points: 5, done: !!c[ContactInfo.EMAIL]?.trim(), step: 'personal' },
    { id: 'phone', label: 'Add your phone number', points: 5, done: !!c[ContactInfo.PHONE]?.trim(), step: 'personal' },
    {
      id: 'about',
      label: about === 0 ? 'Write a short summary' : `Expand your summary (${51 - about} more characters)`,
      points: 15,
      done: about > 50,
      step: 'about',
    },
    {
      id: 'impact',
      label: impacts >= 2 ? 'Key impacts' : more(impacts, 2, 'key impact'),
      points: 5,
      done: impacts >= 2,
      step: 'impact',
    },
    { id: 'education', label: 'Add your education', points: 10, done: data[ResumeField.EDUCATION].length >= 1, step: 'education' },
    { id: 'cert', label: 'Add a certification', points: 5, done: data[ResumeField.CERTIFICATIONS].length >= 1, step: 'certification' },
    { id: 'skills', label: skills >= 3 ? 'Skills' : more(skills, 3, 'skill'), points: 10, done: skills >= 3, step: 'skills' },
    { id: 'tools', label: tools >= 3 ? 'Tools' : more(tools, 3, 'tool'), points: 5, done: tools >= 3, step: 'tools' },
    {
      id: 'experience',
      label: 'Describe what you did in at least one job',
      points: 20,
      done: data[ResumeField.EXPERIENCE].some((e) => e.desc.trim().length > 0),
      step: 'experience',
    },
    {
      id: 'project',
      label: 'Describe at least one project',
      points: 10,
      done: data[ResumeField.PROJECTS].some((p) => p.desc.trim().length > 0),
      step: 'projects',
    },
  ];
};

export const scoreOf = (items: ChecklistItem[]) =>
  items.reduce((sum, i) => sum + (i.done ? i.points : 0), 0);
