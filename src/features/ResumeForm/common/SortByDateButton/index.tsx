import React from 'react';
import { ArrowDownWideNarrow } from 'lucide-react';

import { ResumeField } from '../../../../types';
import { useResumeStore } from '../../../../store/useResumeStore';

type DatedField = ResumeField.EXPERIENCE | ResumeField.VOLUNTEERING;

/**
 * One-click "newest first". Explicit rather than automatic so it never fights
 * a manual drag-and-drop order; ⌘Z undoes it.
 */
const SortByDateButton: React.FC<{ field: DatedField }> = ({ field }) => {
  const items = useResumeStore((s) => s.resumeData[field]);
  const sortByDate = useResumeStore((s) => s.sortByDate);
  const dated = items.filter((i) => i.start).length;
  if (items.length < 2 || dated === 0) return null;

  return (
    <div className="sort-by-date">
      <button
        type="button"
        className="btn"
        onClick={() => sortByDate(field)}
        title="Ongoing first, then by end date. Undo with ⌘Z."
      >
        <ArrowDownWideNarrow size={14} /> Sort newest first
      </button>
      {dated < items.length && (
        <span className="sort-by-date__hint">
          {items.length - dated} without dates will go last
        </span>
      )}
    </div>
  );
};

export default SortByDateButton;
