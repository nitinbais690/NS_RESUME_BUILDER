import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Eye, EyeOff } from 'lucide-react';

import { ResumeField } from '../../types';
import { moveItem, useResumeStore } from '../../store/useResumeStore';
import { LAYOUT_CONFIG, layoutColumns, sectionTitle } from '../../features/ResumeTemplate/layoutConfig';
import { DragHandle, SortableList, useSortableRow } from '../../features/ResumeForm/common/Sortable';
import { SECTION_TITLE_MAX } from '../../lib/resumeIO';

interface RowProps {
  field: ResumeField;
  defaultTitle: string;
}

/** One section: drag handle, editable heading, show/hide toggle. */
const SectionRow: React.FC<RowProps> = ({ field, defaultTitle }) => {
  const { rowProps, handleProps } = useSortableRow(field);
  const custom = useResumeStore((s) => s.sectionTitles[field]);
  const hidden = useResumeStore((s) => s.hiddenSections.includes(field));
  const setSectionTitle = useResumeStore((s) => s.setSectionTitle);
  const toggleSection = useResumeStore((s) => s.toggleSection);
  const label = custom?.trim() || defaultTitle;

  return (
    <li {...rowProps} className={`section-organizer__row ${hidden ? 'is-hidden' : ''}`}>
      <DragHandle label={label} handleProps={handleProps} />
      <input
        className="form-input section-organizer__title"
        aria-label={`Heading for ${field}`}
        // Empty means "use the layout's heading", shown as the placeholder.
        placeholder={defaultTitle}
        value={custom ?? ''}
        maxLength={SECTION_TITLE_MAX}
        onChange={(e) => setSectionTitle(field, e.target.value)}
      />
      {field !== ResumeField.CONTACT && (
        <button
          type="button"
          className="section-organizer__toggle"
          aria-pressed={!hidden}
          aria-label={hidden ? `Show ${label}` : `Hide ${label}`}
          title={hidden ? 'Hidden from the resume. Click to show.' : 'Shown on the resume. Click to hide.'}
          onClick={() => toggleSection(field)}
        >
          {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </li>
  );
};

/**
 * Customize → Sections: drag sections into any order and rename their
 * headings. Two-column layouts keep each section in its column; the order
 * inside each column follows the user's list, on screen and in the PDF.
 */
const SectionOrganizer: React.FC = () => {
  const layout = useResumeStore((s) => s.layout);
  const sectionOrder = useResumeStore(useShallow((s) => s.sectionOrder));
  const isCustom = useResumeStore(
    (s) => s.sectionOrder.length > 0 || Object.keys(s.sectionTitles).length > 0,
  );
  const setSectionOrder = useResumeStore((s) => s.setSectionOrder);
  const resetSections = useResumeStore((s) => s.resetSections);

  const config = LAYOUT_CONFIG[layout];
  const columns = layoutColumns(layout, sectionOrder);
  const twoColumns = columns.left.length > 0 && columns.right.length > 0;
  const lists = [
    { key: 'left' as const, label: 'Left column', fields: columns.left },
    { key: 'right' as const, label: twoColumns ? 'Right column' : '', fields: columns.right },
  ].filter((list) => list.fields.length > 0);

  const defaultTitle = (field: ResumeField) =>
    sectionTitle(
      config,
      { sectionTitles: {} },
      field,
      config.inlineSkills && field === ResumeField.SKILLS ? 'Technical Skills' : field,
    );

  const move = (column: 'left' | 'right', from: number, to: number) => {
    const next = { ...columns, [column]: moveItem(columns[column], from, to) };
    const placed = [...next.left, ...next.right];
    // Keep the user's place for sections this layout doesn't show.
    setSectionOrder([...placed, ...sectionOrder.filter((f) => !placed.includes(f))]);
  };

  return (
    <div className="section-spacing section-organizer">
      <div className="section-spacing__head">
        <span className="control-label">Sections</span>
        <button type="button" className="section-spacing__reset" onClick={resetSections} disabled={!isCustom}>
          Reset
        </button>
      </div>
      <p className="section-organizer__hint">Drag to reorder. Type to rename a heading.</p>
      {lists.map((list) => (
        <div key={list.key} role="group" aria-label={list.label || 'Sections'}>
          {list.label && <p className="layout-picker__group">{list.label}</p>}
          <SortableList ids={list.fields} onMove={(from, to) => move(list.key, from, to)}>
            <ul className="section-organizer__list">
              {list.fields.map((field) => (
                <SectionRow key={field} field={field} defaultTitle={defaultTitle(field)} />
              ))}
            </ul>
          </SortableList>
        </div>
      ))}
    </div>
  );
};

export default SectionOrganizer;
