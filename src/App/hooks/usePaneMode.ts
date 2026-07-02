import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type PaneMode = 'edit' | 'preview';

/**
 * Reads/writes the active pane (edit vs preview) from the URL `?pane` param.
 * Kept in the URL — not the persisted store — so back button / refresh / deep
 * links behave and we don't persist transient UI state to localStorage.
 * Only affects the layout below 1024px; desktop shows both panes regardless.
 */
export const usePaneMode = (): [PaneMode, (mode: PaneMode) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pane: PaneMode =
    searchParams.get('pane') === 'preview' ? 'preview' : 'edit';

  const setPane = useCallback(
    (mode: PaneMode) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('pane', mode);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [pane, setPane];
};
