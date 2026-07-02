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
  icon: LucideIcon;
  component: React.FC;
}

export const FORM_STEPS: FormStep[] = [
  {
    id: 'personal',
    title: 'Personal Details',
    icon: User,
    component: PersonalDetails,
  },
  { id: 'about', title: ResumeField.ABOUT_ME, icon: FileText, component: AboutMe },
  {
    id: 'education',
    title: ResumeField.EDUCATION,
    icon: GraduationCap,
    component: Education,
  },
  {
    id: 'certification',
    title: ResumeField.CERTIFICATIONS,
    icon: GraduationCap,
    component: Certification,
  },
  { id: 'skills', title: ResumeField.SKILLS, icon: Sparkles, component: Skill },
  { id: 'tools', title: ResumeField.TOOLS, icon: Wrench, component: Tool },
  {
    id: 'experience',
    title: ResumeField.EXPERIENCE,
    icon: Briefcase,
    component: Experience,
  },
  {
    id: 'projects',
    title: ResumeField.PROJECTS,
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
