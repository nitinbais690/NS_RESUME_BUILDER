import { useResumeStore } from '../../store/useResumeStore';

export type PaneMode = 'edit' | 'preview';

/**
 * Reads/writes the active pane (edit vs preview) from the Zustand store.
 * Ephemeral per session — resets to 'edit' on refresh (not persisted).
 * Only affects layout below 1024px; desktop shows both panes regardless.
 */
export const usePaneMode = (): [PaneMode, (mode: PaneMode) => void] => {
  const paneMode = useResumeStore((s) => s.paneMode);
  const setPaneMode = useResumeStore((s) => s.setPaneMode);
  return [paneMode, setPaneMode];
};
