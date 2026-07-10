import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
import { LOCAL_STORAGE_KEY } from '../constants';

interface ResumeState {
  resumeData: ResumeData;
  theme: ThemeType;
  layout: LayoutType;
  fontFamily: FontFamily;

  setTheme: (theme: ThemeType) => void;
  setLayout: (layout: LayoutType) => void;
  setFontFamily: (fontFamily: FontFamily) => void;

  updateContactInfo: (info: Partial<ContactInfoType>) => void;
  updateAboutMe: (aboutMe: string) => void;
  updateListField: (
    field: ResumeField.KEY_IMPACT | ResumeField.SKILLS | ResumeField.TOOLS,
    items: string[]
  ) => void;

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
  updateCertification: (
    id: string,
    certification: Partial<CertificationType>
  ) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => {
      // Generates add/remove/update actions for any id-keyed array field
      const entityActions = <T extends { id: string }>(field: ResumeField) => ({
        add: (item: T) =>
          set((s) => ({
            resumeData: {
              ...s.resumeData,
              [field]: [...(s.resumeData[field] as unknown as T[]), item],
            },
          })),
        remove: (id: string) =>
          set((s) => ({
            resumeData: {
              ...s.resumeData,
              [field]: (s.resumeData[field] as unknown as T[]).filter(
                (i) => i.id !== id
              ),
            },
          })),
        update: (id: string, patch: Partial<T>) =>
          set((s) => ({
            resumeData: {
              ...s.resumeData,
              [field]: (s.resumeData[field] as unknown as T[]).map((i) =>
                i.id === id ? { ...i, ...patch } : i
              ),
            },
          })),
      });

      const edu = entityActions<EducationType>(ResumeField.EDUCATION);
      const exp = entityActions<ExperienceType>(ResumeField.EXPERIENCE);
      const proj = entityActions<ProjectType>(ResumeField.PROJECTS);
      const cert = entityActions<CertificationType>(ResumeField.CERTIFICATIONS);

      return {
        resumeData: dummyResumeData,
        theme: 'default',
        layout: 'classic',
        fontFamily: 'Inter, sans-serif',

        setTheme: (theme) => set({ theme }),
        setLayout: (layout) => set({ layout }),
        setFontFamily: (fontFamily) => set({ fontFamily }),

        updateContactInfo: (info) =>
          set((state) => ({
            resumeData: {
              ...state.resumeData,
              [ResumeField.CONTACT]: {
                ...state.resumeData[ResumeField.CONTACT],
                ...info,
              },
            },
          })),

        updateAboutMe: (aboutMe) =>
          set((state) => ({
            resumeData: {
              ...state.resumeData,
              [ResumeField.ABOUT_ME]: aboutMe,
            },
          })),

        updateListField: (field, items) =>
          set((state) => ({
            resumeData: { ...state.resumeData, [field]: items },
          })),

        addEducation: edu.add,
        removeEducation: edu.remove,
        updateEducation: edu.update,

        addExperience: exp.add,
        removeExperience: exp.remove,
        updateExperience: exp.update,

        addProject: proj.add,
        removeProject: proj.remove,
        updateProject: proj.update,

        addCertification: cert.add,
        removeCertification: cert.remove,
        updateCertification: cert.update,
      };
    },
    { name: LOCAL_STORAGE_KEY }
  )
);
