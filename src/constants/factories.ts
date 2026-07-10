import {
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
