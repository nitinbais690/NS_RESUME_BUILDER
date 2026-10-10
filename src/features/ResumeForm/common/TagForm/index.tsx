import React, { useEffect, useRef, useState } from 'react';
import { Trash2, Sparkles, Wrench, TrendingUp, type LucideIcon } from 'lucide-react';

import { ListField, ResumeField } from '../../../../types';
import AddButton from '../AddButton';
import { useResumeStore } from '../../../../store/useResumeStore';
import { EmptyState } from '../EmptyState';
import { AutoGrowTextarea } from '../FormFields';
import { DragHandle, SortableList, useSortableRow } from '../Sortable';
import BulletHints from '../BulletHints';

const LIST_CONFIG: Record<
  ListField,
  { label: string; noun: string; icon: LucideIcon; placeholder: string; multiline: boolean }
> = {
  [ResumeField.SKILLS]: {
    label: 'Add Skill',
    noun: 'skill',
    icon: Sparkles,
    placeholder: 'e.g. React Native',
    multiline: false,
  },
  [ResumeField.TOOLS]: {
    label: 'Add Tool',
    noun: 'tool',
    icon: Wrench,
    placeholder: 'e.g. Xcode',
    multiline: false,
  },
  [ResumeField.KEY_IMPACT]: {
    label: 'Add Impact',
    noun: 'impact',
    icon: TrendingUp,
    placeholder: 'e.g. Cut app startup time by 40% by lazy-loading feature modules',
    multiline: true,
  },
};

type FieldEl = HTMLInputElement | HTMLTextAreaElement;

interface RowProps {
  id: string;
  index: number;
  value: string;
  config: (typeof LIST_CONFIG)[ListField];
  registerRef: (el: FieldEl | null) => void;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<FieldEl>) => void;
  onRemove: () => void;
}

const ListRow: React.FC<RowProps> = ({
  id,
  index,
  value,
  config,
  registerRef,
  onChange,
  onKeyDown,
  onRemove,
}) => {
  const { rowProps, handleProps } = useSortableRow(id);
  const label = `${config.noun} ${index + 1}`;
  const common = {
    placeholder: config.placeholder,
    value,
    'aria-label': label,
    onKeyDown,
  };

  return (
    <div {...rowProps} className="form-skill-row-wrap" data-edit-index={index}>
      <div className="form-skill-row">
        <DragHandle label={label} handleProps={handleProps} />
        {config.multiline ? (
          <AutoGrowTextarea
            {...common}
            rows={1}
            ref={registerRef}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            {...common}
            ref={registerRef}
            className="form-input form-input-text"
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={onRemove}
          className="form-skill-remove"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {config.multiline && <BulletHints text={value} mode="single" />}
    </div>
  );
};

/**
 * Row-per-item editor for Skills, Tools and Key Impact.
 * Keyboard: Enter adds a row below (Shift+Enter = newline in impacts),
 * Backspace on an empty row removes it, ↑/↓ at the edges move between rows.
 */
export const ToolForm: React.FC<{ name: ListField }> = ({ name }) => {
  const fields = useResumeStore((s) => s.resumeData[name]);
  const updateListField = useResumeStore((s) => s.updateListField);
  const reorder = useResumeStore((s) => s.reorder);
  const config = LIST_CONFIG[name];
  const inputs = useRef<(FieldEl | null)[]>([]);
  // Row to focus after the next render (set by add/remove/navigate).
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    if (focusIndex === null) return;
    const el = inputs.current[focusIndex];
    if (el) {
      el.focus();
      const end = el.value.length;
      el.setSelectionRange(end, end);
    }
    setFocusIndex(null);
  }, [focusIndex, fields.length]);

  const insertAt = (i: number) => {
    const next = [...fields];
    next.splice(i, 0, '');
    updateListField(name, next);
    setFocusIndex(i);
  };

  const removeAt = (i: number, focusPrev = false) => {
    updateListField(name, fields.filter((_, idx) => idx !== i));
    if (focusPrev) setFocusIndex(Math.max(0, i - 1));
  };

  const onChange = (i: number, value: string) => {
    const next = [...fields];
    next[i] = value;
    updateListField(name, next);
  };

  const onKeyDown = (i: number) => (e: React.KeyboardEvent<FieldEl>) => {
    const el = e.currentTarget;
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      insertAt(i + 1);
    } else if (e.key === 'Backspace' && el.value === '' && fields.length > 0) {
      e.preventDefault();
      removeAt(i, true);
    } else if (e.key === 'ArrowUp' && el.selectionStart === 0 && i > 0) {
      e.preventDefault();
      setFocusIndex(i - 1);
    } else if (e.key === 'ArrowDown' && el.selectionEnd === el.value.length && i < fields.length - 1) {
      e.preventDefault();
      setFocusIndex(i + 1);
    }
  };

  // Index-based ids: rows have no stable identity, and React keys must not
  // include the value (that remounts the input on every keystroke).
  const ids = fields.map((_, i) => `${name}-${i}`);

  return (
    <section>
      <AddButton onAdd={() => insertAt(fields.length)} label={config.label} />

      {fields.length === 0 ? (
        <EmptyState
          icon={config.icon}
          message={`No ${name.toLowerCase()} added yet.`}
          actionLabel={config.label}
          onAction={() => insertAt(0)}
        />
      ) : (
        <div className="form-card">
          <div className="form-card__body">
            <SortableList ids={ids} onMove={(from, to) => reorder(name, from, to)}>
              {fields.map((item, i) => (
                <ListRow
                  key={ids[i]}
                  id={ids[i]}
                  index={i}
                  value={item}
                  config={config}
                  registerRef={(el) => {
                    inputs.current[i] = el;
                  }}
                  onChange={(v) => onChange(i, v)}
                  onKeyDown={onKeyDown(i)}
                  onRemove={() => removeAt(i)}
                />
              ))}
            </SortableList>
            <p className="form-hint">
              <kbd>Enter</kbd> adds the next {config.noun}
              {config.multiline && (
                <>
                  , <kbd>Shift</kbd>+<kbd>Enter</kbd> for a new line
                </>
              )}
              . Drag <span aria-hidden="true">⋮⋮</span> to reorder.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
