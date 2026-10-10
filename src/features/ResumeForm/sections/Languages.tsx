import React from 'react';
import { Languages as LanguagesIcon, Trash2, ChevronDown } from 'lucide-react';

import { LanguageLevel, LanguageType, ResumeField } from '../../../types';
import { createLanguage } from '../../../constants/factories';
import { EmptyState } from '../common/EmptyState';
import AddButton from '../common/AddButton';
import { DragHandle, SortableList, useSortableRow } from '../common/Sortable';
import { useResumeStore } from '../../../store/useResumeStore';

const LEVELS: LanguageLevel[] = ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'];

const LanguageRow: React.FC<{ item: LanguageType; index: number }> = ({ item, index }) => {
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const removeLanguage = useResumeStore((s) => s.removeLanguage);
  const { rowProps, handleProps } = useSortableRow(item.id);
  const label = `language ${index + 1}`;

  return (
    <div {...rowProps} className="form-skill-row-wrap" data-edit-id={item.id}>
      <div className="form-skill-row language-row">
        <DragHandle label={label} handleProps={handleProps} />
        <input
          className="form-input"
          aria-label={label}
          placeholder="e.g. Spanish"
          value={item.name}
          onChange={(e) => updateLanguage(item.id, { name: e.target.value })}
        />
        <div className="mini-select-wrapper language-row__level">
          <select
            className="mini-select"
            aria-label={`Level for ${item.name || label}`}
            value={item.level}
            onChange={(e) => updateLanguage(item.id, { level: e.target.value as LanguageLevel })}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <ChevronDown className="mini-select-chevron" size={14} />
        </div>
        <button
          type="button"
          className="form-skill-remove"
          aria-label={`Remove ${label}`}
          onClick={() => removeLanguage(item.id)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

const Languages: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.LANGUAGES]);
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const reorder = useResumeStore((s) => s.reorder);
  const onAdd = () => addLanguage(createLanguage());

  return (
    <section>
      <AddButton onAdd={onAdd} label="Add Language" />
      {items.length === 0 ? (
        <EmptyState
          icon={LanguagesIcon}
          message="No languages added yet."
          actionLabel="Add Language"
          onAction={onAdd}
        />
      ) : (
        <div className="form-card">
          <div className="form-card__body">
            <SortableList
              ids={items.map((i) => i.id)}
              onMove={(from, to) => reorder(ResumeField.LANGUAGES, from, to)}
            >
              {items.map((item, i) => (
                <LanguageRow key={item.id} item={item} index={i} />
              ))}
            </SortableList>
          </div>
        </div>
      )}
    </section>
  );
};

export default Languages;
