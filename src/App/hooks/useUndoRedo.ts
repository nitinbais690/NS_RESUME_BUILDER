import { useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';

export const useUndoRedo = () => {
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (!isMeta) return;

      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);
};
