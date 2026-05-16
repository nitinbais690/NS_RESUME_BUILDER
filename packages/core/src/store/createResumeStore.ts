import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import {
  ResumeData,
  ResumeField,
  ContactInfoType,
  EducationType,
  ExperienceType,
  ProjectType,
  CertificationType,
  ThemeType,
  LayoutType,
  FontFamily,
} from '../types';
import dummyResumeData from '../data';

export interface ResumeState {
  resumeData: ResumeData;
  theme: ThemeType;
  layout: LayoutType;
  fontFamily: FontFamily;

  // Actions
  setResumeData: (data: ResumeData) => void;
  setTheme: (theme: ThemeType) => void;
  setLayout: (layout: LayoutType) => void;
  setFontFamily: (fontFamily: FontFamily) => void;

  updateContactInfo: (info: Partial<ContactInfoType>) => void;
  updateAboutMe: (aboutMe: string) => void;

  // Arrays of Strings (Key Impact, Skills, Tools)
  updateListField: (
    field: ResumeField.KEY_IMPACT | ResumeField.SKILLS | ResumeField.TOOLS,
    items: string[],
  ) => void;

  // Complex Arrays
  addEducation: (education: EducationType) => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, education: Partial<EducationType>) => void;

  addExperience: (experience: ExperienceType) => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, experience: Partial<ExperienceType>) => void;

  addProject: (project: ProjectType) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, project: Partial<ProjectType>) => void;

  addCertification: (certification: CertificationType) => void;
  removeCertification: (id: string) => void;
  updateCertification: (id: string, certification: Partial<CertificationType>) => void;
}

type ResumeStoreCreator = (set: any, get: any, store: any) => ResumeState;

const createResumeStateSlice: ResumeStoreCreator = (set) => ({
  resumeData: dummyResumeData,
  theme: 'default',
  layout: 'classic',
  fontFamily: 'Inter',

  setResumeData: (data) => set({ resumeData: data }),
  setTheme: (theme) => set({ theme }),
  setLayout: (layout) => set({ layout }),
  setFontFamily: (fontFamily) => set({ fontFamily }),

  updateContactInfo: (info) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.CONTACT]: { ...state.resumeData[ResumeField.CONTACT], ...info },
      },
    })),

  updateAboutMe: (aboutMe) =>
    set((state) => ({
      resumeData: { ...state.resumeData, [ResumeField.ABOUT_ME]: aboutMe },
    })),

  updateListField: (field, items) =>
    set((state) => ({
      resumeData: { ...state.resumeData, [field]: items },
    })),

  addEducation: (education) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.EDUCATION]: [...state.resumeData[ResumeField.EDUCATION], education],
      },
    })),

  removeEducation: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.EDUCATION]: state.resumeData[ResumeField.EDUCATION].filter(
          (item) => item.id !== id,
        ),
      },
    })),

  updateEducation: (id, education) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.EDUCATION]: state.resumeData[ResumeField.EDUCATION].map((item) =>
          item.id === id ? { ...item, ...education } : item,
        ),
      },
    })),

  addExperience: (experience) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.EXPERIENCE]: [...state.resumeData[ResumeField.EXPERIENCE], experience],
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.EXPERIENCE]: state.resumeData[ResumeField.EXPERIENCE].filter(
          (item) => item.id !== id,
        ),
      },
    })),

  updateExperience: (id, experience) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.EXPERIENCE]: state.resumeData[ResumeField.EXPERIENCE].map((item) =>
          item.id === id ? { ...item, ...experience } : item,
        ),
      },
    })),

  addProject: (project) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.PROJECTS]: [...state.resumeData[ResumeField.PROJECTS], project],
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.PROJECTS]: state.resumeData[ResumeField.PROJECTS].filter(
          (item) => item.id !== id,
        ),
      },
    })),

  updateProject: (id, project) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.PROJECTS]: state.resumeData[ResumeField.PROJECTS].map((item) =>
          item.id === id ? { ...item, ...project } : item,
        ),
      },
    })),

  addCertification: (certification) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.CERTIFICATIONS]: [
          ...state.resumeData[ResumeField.CERTIFICATIONS],
          certification,
        ],
      },
    })),

  removeCertification: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.CERTIFICATIONS]: state.resumeData[ResumeField.CERTIFICATIONS].filter(
          (item) => item.id !== id,
        ),
      },
    })),

  updateCertification: (id, certification) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        [ResumeField.CERTIFICATIONS]: state.resumeData[ResumeField.CERTIFICATIONS].map((item) =>
          item.id === id ? { ...item, ...certification } : item,
        ),
      },
    })),
});

/**
 * Creates a persisted resume store with a platform-specific storage backend.
 *
 * @example Web
 *   import { createResumeStore } from '@ns-resume/core';
 *   export const useResumeStore = createResumeStore({ name: 'ns_cv_resume_data' });
 *
 * @example Mobile (React Native + AsyncStorage)
 *   import { createResumeStore } from '@ns-resume/core';
 *   import { createJSONStorage } from 'zustand/middleware';
 *   import AsyncStorage from '@react-native-async-storage/async-storage';
 *   export const useResumeStore = createResumeStore({
 *     name: 'ns_cv_resume_data',
 *     storage: createJSONStorage(() => AsyncStorage),
 *   });
 */
export function createResumeStore(persistOptions: PersistOptions<ResumeState>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return create<ResumeState>()(persist(createResumeStateSlice as any, persistOptions));
}
