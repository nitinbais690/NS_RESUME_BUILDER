import {
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

export const createCertification = (): CertificationType => ({
  id: crypto.randomUUID(),
  name: '',
  issuer: '',
  date: '',
  link: '',
});

export const DEFAULT_STYLE: ResumeStyle = {
  theme: 'default',
  layout: 'classic',
  fontFamily: 'Inter, sans-serif',
  accentColor: null,
  fontScale: 1,
  qrTarget: 'none',
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
});
