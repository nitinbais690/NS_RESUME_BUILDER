import {
  AwardType,
  LanguageType,
  VolunteerType,
  ContactInfo,
  ResumeData,
  ResumeField,
  ResumeStyle,
  CertificationType,
  EducationType,
  ExperienceType,
  ProjectType,
} from '../types';

export const createEducation = (): EducationType => ({
  id: crypto.randomUUID(),
  degree: '',
  school: '',
  year: '',
  score: '',
});

export const createExperience = (): ExperienceType => ({
  id: crypto.randomUUID(),
  title: '',
  company: '',
  date: '',
  desc: '',
  technologies: [],
});

export const createProject = (): ProjectType => ({
  id: crypto.randomUUID(),
  name: '',
  link: '',
  desc: '',
  technologies: [],
});

export const createLanguage = (): LanguageType => ({
  id: crypto.randomUUID(),
  name: '',
  level: 'Professional',
});

export const createAward = (): AwardType => ({
  id: crypto.randomUUID(),
  title: '',
  issuer: '',
  date: '',
  desc: '',
});

export const createVolunteer = (): VolunteerType => ({
  id: crypto.randomUUID(),
  role: '',
  org: '',
  date: '',
  desc: '',
});

export const createCertification = (): CertificationType => ({
  id: crypto.randomUUID(),
  name: '',
  issuer: '',
  date: '',
  link: '',
  desc: '',
});

export const DEFAULT_STYLE: ResumeStyle = {
  theme: 'default',
  layout: 'compact',
  fontFamily: 'Inter, sans-serif',
  accentColor: null,
  fontScale: 1,
  spacingScale: 1,
  gaps: { section: 1, heading: 1, entry: 1 },
  qrTarget: 'none',
  dateFormat: 'short',
  hiddenSections: [],
};

export const createEmptyResumeData = (): ResumeData => ({
  [ResumeField.CONTACT]: {
    [ContactInfo.NAME]: '',
    [ContactInfo.POSITION]: '',
    [ContactInfo.PHONE]: '',
    [ContactInfo.EMAIL]: '',
    [ContactInfo.LINKEDIN]: '',
    [ContactInfo.GITHUB]: '',
    [ContactInfo.LOCATION]: '',
  },
  [ResumeField.ABOUT_ME]: '',
  [ResumeField.KEY_IMPACT]: [],
  [ResumeField.SKILLS]: [],
  [ResumeField.TOOLS]: [],
  [ResumeField.EDUCATION]: [],
  [ResumeField.EXPERIENCE]: [],
  [ResumeField.PROJECTS]: [],
  [ResumeField.CERTIFICATIONS]: [],
  [ResumeField.LANGUAGES]: [],
  [ResumeField.AWARDS]: [],
  [ResumeField.VOLUNTEERING]: [],
});
