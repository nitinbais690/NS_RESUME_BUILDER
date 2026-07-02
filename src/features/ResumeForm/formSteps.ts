import {
  User,
  FileText,
  GraduationCap,
  Wrench,
  Briefcase,
  FolderCode,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { ResumeField } from '../../types';

import PersonalDetails from './sections/PersonalDetails';
import AboutMe from './sections/AboutMe';
import Education from './sections/Education';
import Certification from './sections/Certification';
import Skill from './sections/Skill';
import Tool from './sections/Tool';
import Experience from './sections/Experience';
import Project from './sections/Project';

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  component: React.FC;
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
    description: 'A short professional summary.',
    icon: FileText,
    component: AboutMe,
  },
  {
    id: 'education',
    title: ResumeField.EDUCATION,
    description: 'Your degrees and institutions.',
    icon: GraduationCap,
    component: Education,
  },
  {
    id: 'certification',
    title: ResumeField.CERTIFICATIONS,
    description: "Licenses and certifications you've earned.",
    icon: GraduationCap,
    component: Certification,
  },
  {
    id: 'skills',
    title: ResumeField.SKILLS,
    description: 'Key skills you want to highlight.',
    icon: Sparkles,
    component: Skill,
  },
  {
    id: 'tools',
    title: ResumeField.TOOLS,
    description: 'Tools and technologies you work with.',
    icon: Wrench,
    component: Tool,
  },
  {
    id: 'experience',
    title: ResumeField.EXPERIENCE,
    description: 'Your work history and achievements.',
    icon: Briefcase,
    component: Experience,
  },
  {
    id: 'projects',
    title: ResumeField.PROJECTS,
    description: "Notable projects you've built.",
    icon: FolderCode,
    component: Project,
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
