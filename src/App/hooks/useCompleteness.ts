import { useResumeStore } from '../../store/useResumeStore';
import { ContactInfo, ResumeField } from '../../types';

export const useCompleteness = (): number => {
  const data = useResumeStore((s) => s.resumeData);
  let score = 0;

  const contact = data[ResumeField.CONTACT];
  if (contact[ContactInfo.NAME]) score += 5;
  if (contact[ContactInfo.POSITION]) score += 5;
  if (contact[ContactInfo.EMAIL]) score += 5;
  if (contact[ContactInfo.PHONE]) score += 5;

  if (data[ResumeField.ABOUT_ME].length > 50) score += 15;
  if (data[ResumeField.EDUCATION].length >= 1) score += 10;
  if (data[ResumeField.CERTIFICATIONS].length >= 1) score += 5;
  if (data[ResumeField.SKILLS].length >= 3) score += 10;
  if (data[ResumeField.TOOLS].length >= 3) score += 5;
  if (data[ResumeField.EXPERIENCE].some((e) => e.desc.length > 0)) score += 20;
  if (data[ResumeField.PROJECTS].some((p) => p.desc.length > 0)) score += 10;
  if (data[ResumeField.KEY_IMPACT].length >= 2) score += 5;

  return score;
};
