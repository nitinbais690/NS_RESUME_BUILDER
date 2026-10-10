import {
  User,
  FileText,
  GraduationCap,
  Award,
  Wrench,
  Briefcase,
  FolderCode,
  Sparkles,
  TrendingUp,
  Languages as LanguagesIcon,
  Trophy,
  HeartHandshake,
  type LucideIcon,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { ResumeField } from '../../types';

import PersonalDetails from './sections/PersonalDetails';
import AboutMe from './sections/AboutMe';
import KeyImpact from './sections/KeyImpact';
import Education from './sections/Education';
import Certification from './sections/Certification';
import Skill from './sections/Skill';
import Tool from './sections/Tool';
import Experience from './sections/Experience';
import Project from './sections/Project';
import Languages from './sections/Languages';
import Awards from './sections/Awards';
import Volunteering from './sections/Volunteering';

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  component: React.FC;
  /** Resume section this step edits; enables the show/hide toggle. */
  field?: ResumeField;
}

export const FORM_STEPS: FormStep[] = [
  {
    id: 'personal',
    title: 'Personal Details',
    description: 'Your name, role, and contact details.',
    icon: User,
    component: PersonalDetails,
  },
  {
    id: 'about',
    title: ResumeField.ABOUT_ME,
    field: ResumeField.ABOUT_ME,
    description: 'A short professional summary.',
    icon: FileText,
    component: AboutMe,
  },
  {
    id: 'impact',
    title: ResumeField.KEY_IMPACT,
    field: ResumeField.KEY_IMPACT,
    description: 'Your top measurable wins, one per line.',
    icon: TrendingUp,
    component: KeyImpact,
  },
  {
    id: 'education',
    title: ResumeField.EDUCATION,
    field: ResumeField.EDUCATION,
    description: 'Your degrees and institutions.',
    icon: GraduationCap,
    component: Education,
  },
  {
    id: 'certification',
    title: ResumeField.CERTIFICATIONS,
    field: ResumeField.CERTIFICATIONS,
    description: "Licenses and certifications you've earned.",
    icon: Award,
    component: Certification,
  },
  {
    id: 'skills',
    title: ResumeField.SKILLS,
    field: ResumeField.SKILLS,
    description: 'Key skills you want to highlight.',
    icon: Sparkles,
    component: Skill,
  },
  {
    id: 'tools',
    title: ResumeField.TOOLS,
    field: ResumeField.TOOLS,
    description: 'Tools and technologies you work with.',
    icon: Wrench,
    component: Tool,
  },
  {
    id: 'experience',
    title: ResumeField.EXPERIENCE,
    field: ResumeField.EXPERIENCE,
    description: 'Your work history and achievements.',
    icon: Briefcase,
    component: Experience,
  },
  {
    id: 'projects',
    title: ResumeField.PROJECTS,
    field: ResumeField.PROJECTS,
    description: "Notable projects you've built.",
    icon: FolderCode,
    component: Project,
  },
  {
    id: 'languages',
    title: ResumeField.LANGUAGES,
    field: ResumeField.LANGUAGES,
    description: 'Languages you speak and how well.',
    icon: LanguagesIcon,
    component: Languages,
  },
  {
    id: 'awards',
    title: ResumeField.AWARDS,
    field: ResumeField.AWARDS,
    description: 'Recognition, prizes and honors.',
    icon: Trophy,
    component: Awards,
  },
  {
    id: 'volunteering',
    title: ResumeField.VOLUNTEERING,
    field: ResumeField.VOLUNTEERING,
    description: 'Unpaid work, mentoring and community roles.',
    icon: HeartHandshake,
    component: Volunteering,
  },
];

/**
 * Derives the active form step from the current URL. Shared by the section rail
 * and the form footer so their active state always stays in sync.
 */
export const useActiveStep = (): number => {
  const location = useLocation();
  const activePath = location.pathname.substring(
    location.pathname.lastIndexOf('/') + 1,
  );
  const index = FORM_STEPS.findIndex((step) => step.id === activePath);
  return index !== -1 ? index : 0;
};
