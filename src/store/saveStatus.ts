import { create } from 'zustand';
import type { StateStorage } from 'zustand/middleware';

export type SaveState = 'saved' | 'error';

interface SaveStatus {
  state: SaveState;
  /** When the last successful write happened (ms). */
  savedAt: number;
  error: string | null;
}

/** Outcome of the most recent write to localStorage, for the "Saved" indicator. */
export const useSaveStatus = create<SaveStatus>(() => ({
  state: 'saved',
  savedAt: Date.now(),
  error: null,
}));

const describe = (err: unknown) =>
  err instanceof DOMException && /quota/i.test(err.name)
    ? 'Browser storage is full.'
    : 'This browser is blocking storage (private mode or site settings).';

/**
 * localStorage that never throws and reports every write. Zustand's persist
 * middleware writes on each change; without this a full or blocked storage
 * would silently lose work.
 */
export const reportingStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
      useSaveStatus.setState({ state: 'saved', savedAt: Date.now(), error: null });
    } catch (err) {
      useSaveStatus.setState({ state: 'error', error: describe(err) });
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* nothing to clean up */
    }
  },
};
