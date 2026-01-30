export type ThemeType = 'default' | 'blue' | 'teal' | 'purple';
export type LayoutType =
  | 'classic'
  | 'modern'
  | 'minimalist'
  | 'executive'
  | 'creative';
export type FontFamily = 'Inter, sans-serif' | 'Roboto, sans-serif' | 'Arial';

export interface EducationType {
  id: string;
  degree: string;
  school: string;
  year: string;
  score: string;
}

export type CertificationType = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
};

export interface ProjectType {
  id: string;
  name: string;
  link: string;
  desc: string;
  technologies: string[];
}

export interface ExperienceType {
  id: string;
  title: string;
  company: string;
  date: string;
  desc: string;
  technologies: string[];
}

export const enum ContactInfo {
  NAME = 'Name',
  POSITION = 'Position',
  PHONE = 'Phone',
  EMAIL = 'Email',
  LINKEDIN = 'LinkedIn',
  GITHUB = 'GitHub',
  LOCATION = 'Location',
}

export enum ResumeField {
  CONTACT = 'Contact',
  KEY_IMPACT = 'Key Impact',
  TOOLS = 'Tools',
  ABOUT_ME = 'About Me',
  EDUCATION = 'Education',
  SKILLS = 'Skills',
  EXPERIENCE = 'Experience',
  PROJECTS = 'Projects',
  CERTIFICATIONS = 'Certifications',
}

export interface ContactInfoType {
  [ContactInfo.NAME]: string;
  [ContactInfo.POSITION]: string;
  [ContactInfo.PHONE]: string;
  [ContactInfo.EMAIL]: string;
  [ContactInfo.LINKEDIN]: string;
  [ContactInfo.GITHUB]?: string;
  [ContactInfo.LOCATION]?: string;
}

export interface ResumeData {
  [ResumeField.CONTACT]: ContactInfoType;
  [ResumeField.ABOUT_ME]: string;
  [ResumeField.EDUCATION]: EducationType[];
  [ResumeField.SKILLS]: string[];
  [ResumeField.TOOLS]: string[];
  [ResumeField.EXPERIENCE]: ExperienceType[];
  [ResumeField.PROJECTS]: ProjectType[];
  [ResumeField.CERTIFICATIONS]: Array<CertificationType>;
  [ResumeField.KEY_IMPACT]: string[];
}
