export type ThemeType = 'default' | 'blue' | 'teal' | 'purple';
export type LayoutType =
  | 'classic'
  | 'modern'
  | 'minimalist'
  | 'executive'
  | 'creative'
  | 'ats';
export type FontFamily = 'Inter, sans-serif' | 'Roboto, sans-serif' | 'Arial';
/** App chrome appearance. The resume sheet itself always renders light. */
export type ColorScheme = 'system' | 'light' | 'dark';

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
  /** Display string, e.g. "Jan 2022 – Present" (derived from start/end when set). */
  date: string;
  /** "YYYY-MM" from the month picker. */
  start?: string;
  /** "YYYY-MM", or "present" for an ongoing role. */
  end?: string;
  desc: string;
  technologies: string[];
}

export type LanguageLevel = 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';

export interface LanguageType {
  id: string;
  name: string;
  level: LanguageLevel;
}

export interface AwardType {
  id: string;
  title: string;
  issuer: string;
  date: string;
  desc: string;
}

/** Volunteering mirrors a job: role at an organization over a date range. */
export interface VolunteerType {
  id: string;
  role: string;
  org: string;
  date: string;
  start?: string;
  end?: string;
  desc: string;
}

export enum ContactInfo {
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
  LANGUAGES = 'Languages',
  AWARDS = 'Awards',
  VOLUNTEERING = 'Volunteering',
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
  [ResumeField.LANGUAGES]: LanguageType[];
  [ResumeField.AWARDS]: AwardType[];
  [ResumeField.VOLUNTEERING]: VolunteerType[];
}

/** Everything about how a resume looks (not what it says). */
export interface ResumeStyle {
  theme: ThemeType;
  layout: LayoutType;
  fontFamily: FontFamily;
  /** Custom brand color (#rrggbb). Overrides the theme's color when set. */
  accentColor: string | null;
  /** Multiplier for every resume font size, e.g. 0.9 – 1.15. */
  fontScale: number;
  /** Which profile link the QR code in the resume header opens, if any. */
  qrTarget: QrTarget;
  /** Sections the user switched off; their content is kept, just not shown. */
  hiddenSections: ResumeField[];
}

export type QrTarget = 'none' | 'linkedin' | 'github';

/** One named resume version, e.g. "Mobile Lead" vs "Frontend". */
export interface SavedResume {
  id: string;
  name: string;
  updatedAt: number;
  data: ResumeData;
  style: ResumeStyle;
}

/** List-of-string fields that the form edits row by row. */
export type ListField =
  | ResumeField.KEY_IMPACT
  | ResumeField.SKILLS
  | ResumeField.TOOLS;

/** Id-keyed entity fields rendered as cards. */
export type EntityField =
  | ResumeField.EXPERIENCE
  | ResumeField.PROJECTS
  | ResumeField.EDUCATION
  | ResumeField.CERTIFICATIONS
  | ResumeField.LANGUAGES
  | ResumeField.AWARDS
  | ResumeField.VOLUNTEERING;
