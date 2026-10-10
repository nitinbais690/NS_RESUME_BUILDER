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
  ColorScheme,
  ResumeStyle,
  SavedResume,
  ListField,
  EntityField,
  QrTarget,
} from '../types';
import dummyResumeData from '../data';
import { LOCAL_STORAGE_KEY } from '../constants';
import { DEFAULT_STYLE, createEmptyResumeData } from '../constants/factories';
import { normalizeResumeData, normalizeStyle } from '../lib/resumeIO';

/** Moves one array item; returns the same array when the move is a no-op. */
export const moveItem = <T,>(items: T[], from: number, to: number): T[] => {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

interface ResumeState extends ResumeStyle {
  /**
   * The active resume's content and style live at the top level (resumeData,
   * theme, layout, …) so every component reads them directly. `resumes` holds
   * all versions; the active entry there is refreshed on switch and on persist.
   */
  resumeData: ResumeData;
  resumes: Record<string, SavedResume>;
  activeResumeId: string;
  editedAt: number;

  colorScheme: ColorScheme;
  /** Last job ad pasted into Job match (kept across reloads). */
  jobDescription: string;
  setJobDescription: (text: string) => void;
  _past: ResumeData[];
  _future: ResumeData[];

  setTheme: (theme: ThemeType) => void;
  setLayout: (layout: LayoutType) => void;
  setFontFamily: (fontFamily: FontFamily) => void;
  setAccentColor: (accentColor: string | null) => void;
  setFontScale: (fontScale: number) => void;
  setQrTarget: (qrTarget: QrTarget) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;

  updateContactInfo: (info: Partial<ContactInfoType>) => void;
  updateAboutMe: (aboutMe: string) => void;
  updateListField: (field: ListField, items: string[]) => void;
  /** Reorders any list or entity field (drag and drop). */
  reorder: (field: ListField | EntityField, from: number, to: number) => void;

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

  /** Creates a resume (blank or a copy of the active one) and switches to it. */
  createResume: (name: string, mode: 'blank' | 'duplicate') => string;
  /** Adds imported content as a new resume and switches to it. */
  importResume: (resume: Pick<SavedResume, 'name' | 'data' | 'style'>) => string;
  switchResume: (id: string) => void;
  renameResume: (id: string, name: string) => void;
  /** Deletes a resume. The last remaining resume can't be deleted. */
  deleteResume: (id: string) => void;
  /** Snapshot of the active resume (content + style) as currently edited. */
  getActiveResume: () => SavedResume;

  undo: () => void;
  redo: () => void;

  paneMode: 'edit' | 'preview';
  setPaneMode: (mode: 'edit' | 'preview') => void;
}

export const pickStyle = (s: ResumeStyle): ResumeStyle => ({
  theme: s.theme,
  layout: s.layout,
  fontFamily: s.fontFamily,
  accentColor: s.accentColor,
  fontScale: s.fontScale,
  qrTarget: s.qrTarget,
});

const snapshot = (s: ResumeState): SavedResume => ({
  id: s.activeResumeId,
  name: s.resumes[s.activeResumeId]?.name ?? 'My Resume',
  updatedAt: s.editedAt,
  data: s.resumeData,
  style: pickStyle(s),
});

/** Top-level fields to load when a resume becomes active. */
const loadResume = (r: SavedResume) => ({
  activeResumeId: r.id,
  resumeData: r.data,
  editedAt: r.updatedAt,
  ...pickStyle(r.style),
  _past: [],
  _future: [],
});

const FIRST_ID = 'resume-1';

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => {
      // Snapshot current resumeData into _past, clear _future, apply newResumeData
      const withHistory = (s: ResumeState, newResumeData: ResumeData): Partial<ResumeState> => ({
        resumeData: newResumeData,
        editedAt: Date.now(),
        _past: [...s._past, s.resumeData].slice(-50),
        _future: [],
      });

      // Generates add/remove/update actions for any id-keyed array field
      const entityActions = <T extends { id: string }>(field: ResumeField) => ({
        add: (item: T) =>
          set((s) =>
            withHistory(s, {
              ...s.resumeData,
              [field]: [...(s.resumeData[field] as unknown as T[]), item],
            })
          ),
        remove: (id: string) =>
          set((s) =>
            withHistory(s, {
              ...s.resumeData,
              [field]: (s.resumeData[field] as unknown as T[]).filter(
                (i) => i.id !== id
              ),
            })
          ),
        update: (id: string, patch: Partial<T>) =>
          set((s) =>
            withHistory(s, {
              ...s.resumeData,
              [field]: (s.resumeData[field] as unknown as T[]).map((i) =>
                i.id === id ? { ...i, ...patch } : i
              ),
            })
          ),
      });

      const edu = entityActions<EducationType>(ResumeField.EDUCATION);
      const exp = entityActions<ExperienceType>(ResumeField.EXPERIENCE);
      const proj = entityActions<ProjectType>(ResumeField.PROJECTS);
      const cert = entityActions<CertificationType>(ResumeField.CERTIFICATIONS);

      // Saves the active resume into the map and makes `next` active.
      const addAndSwitch = (next: SavedResume) =>
        set((s) => ({
          resumes: { ...s.resumes, [s.activeResumeId]: snapshot(s), [next.id]: next },
          ...loadResume(next),
        }));

      const now = Date.now();

      return {
        resumeData: dummyResumeData,
        ...DEFAULT_STYLE,
        resumes: {
          [FIRST_ID]: {
            id: FIRST_ID,
            name: 'My Resume',
            updatedAt: now,
            data: dummyResumeData,
            style: DEFAULT_STYLE,
          },
        },
        activeResumeId: FIRST_ID,
        editedAt: now,
        colorScheme: 'system',
        jobDescription: '',
        setJobDescription: (jobDescription) => set({ jobDescription }),
        _past: [],
        _future: [],

        setTheme: (theme) => set({ theme, accentColor: null }),
        setLayout: (layout) => set({ layout }),
        setFontFamily: (fontFamily) => set({ fontFamily }),
        setAccentColor: (accentColor) => set({ accentColor }),
        setFontScale: (fontScale) =>
          set({ fontScale: Math.min(Math.max(fontScale, 0.8), 1.25) }),
        setQrTarget: (qrTarget) => set({ qrTarget }),
        setColorScheme: (colorScheme) => set({ colorScheme }),

        updateContactInfo: (info) =>
          set((s) =>
            withHistory(s, {
              ...s.resumeData,
              [ResumeField.CONTACT]: {
                ...s.resumeData[ResumeField.CONTACT],
                ...info,
              },
            })
          ),

        updateAboutMe: (aboutMe) =>
          set((s) =>
            withHistory(s, {
              ...s.resumeData,
              [ResumeField.ABOUT_ME]: aboutMe,
            })
          ),

        updateListField: (field, items) =>
          set((s) =>
            withHistory(s, { ...s.resumeData, [field]: items })
          ),

        reorder: (field, from, to) =>
          set((s) => {
            const items = s.resumeData[field] as unknown[];
            const next = moveItem(items, from, to);
            if (next === items) return {};
            return withHistory(s, { ...s.resumeData, [field]: next });
          }),

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

        createResume: (name, mode) => {
          const s = get();
          const id = crypto.randomUUID();
          addAndSwitch({
            id,
            name: name.trim() || 'Untitled resume',
            updatedAt: Date.now(),
            data:
              mode === 'duplicate'
                ? structuredClone(s.resumeData)
                : createEmptyResumeData(),
            style: mode === 'duplicate' ? pickStyle(s) : { ...DEFAULT_STYLE },
          });
          return id;
        },

        importResume: ({ name, data, style }) => {
          const id = crypto.randomUUID();
          addAndSwitch({ id, name, updatedAt: Date.now(), data, style });
          return id;
        },

        switchResume: (id) =>
          set((s) => {
            const target = s.resumes[id];
            if (!target || id === s.activeResumeId) return {};
            return {
              resumes: { ...s.resumes, [s.activeResumeId]: snapshot(s) },
              ...loadResume(target),
            };
          }),

        renameResume: (id, name) =>
          set((s) => {
            const target = s.resumes[id];
            const trimmed = name.trim();
            if (!target || !trimmed) return {};
            return { resumes: { ...s.resumes, [id]: { ...target, name: trimmed } } };
          }),

        deleteResume: (id) =>
          set((s) => {
            const ids = Object.keys(s.resumes);
            if (!s.resumes[id] || ids.length <= 1) return {};
            const rest = { ...s.resumes };
            delete rest[id];
            if (id !== s.activeResumeId) return { resumes: rest };
            // Deleting the active one: fall back to the most recently edited.
            const next = Object.values(rest).sort((a, b) => b.updatedAt - a.updatedAt)[0];
            return { resumes: rest, ...loadResume(next) };
          }),

        getActiveResume: () => snapshot(get()),

        undo: () =>
          set((s) => {
            if (s._past.length === 0) return {};
            const previous = s._past[s._past.length - 1];
            return {
              resumeData: previous,
              _past: s._past.slice(0, -1),
              _future: [s.resumeData, ...s._future].slice(0, 50),
            };
          }),

        redo: () =>
          set((s) => {
            if (s._future.length === 0) return {};
            const next = s._future[0];
            return {
              resumeData: next,
              _past: [...s._past, s.resumeData].slice(-50),
              _future: s._future.slice(1),
            };
          }),

        paneMode: 'edit',
        setPaneMode: (mode) => set({ paneMode: mode }),
      };
    },
    {
      name: LOCAL_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({
        resumeData: state.resumeData,
        ...pickStyle(state),
        colorScheme: state.colorScheme,
        jobDescription: state.jobDescription,
        activeResumeId: state.activeResumeId,
        editedAt: state.editedAt,
        // Keep the stored copy of the active resume current, so the list and
        // exports never show stale content after a reload.
        resumes: { ...state.resumes, [state.activeResumeId]: snapshot(state) },
      }),
      // v0 (single resume, no `resumes` map) → v1. Existing work becomes the
      // first saved resume; nothing is lost.
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Record<string, unknown>;
        if (version >= 1) return old as unknown as ResumeState;
        const data = normalizeResumeData(old.resumeData ?? dummyResumeData);
        const style = normalizeStyle(old);
        const now = Date.now();
        return {
          ...old,
          resumeData: data,
          ...style,
          activeResumeId: FIRST_ID,
          editedAt: now,
          resumes: {
            [FIRST_ID]: { id: FIRST_ID, name: 'My Resume', updatedAt: now, data, style },
          },
        } as unknown as ResumeState;
      },
    }
  )
);
