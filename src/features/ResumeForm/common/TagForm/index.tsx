import { ResumeField } from '../../../../types';
import { Trash2, Sparkles, Wrench, TrendingUp, type LucideIcon } from 'lucide-react';
import AddButton from '../AddButton';
import { useResumeStore } from '../../../../store/useResumeStore';
import { EmptyState } from '../EmptyState';

type ListField = ResumeField.KEY_IMPACT | ResumeField.SKILLS | ResumeField.TOOLS;

const LIST_CONFIG: Record<
  ListField,
  { label: string; icon: LucideIcon; placeholder: string; multiline: boolean }
> = {
  [ResumeField.SKILLS]: {
    label: 'Add Skill',
    icon: Sparkles,
    placeholder: 'e.g. React Native',
    multiline: false,
  },
  [ResumeField.TOOLS]: {
    label: 'Add Tool',
    icon: Wrench,
    placeholder: 'e.g. Xcode',
    multiline: false,
  },
  [ResumeField.KEY_IMPACT]: {
    label: 'Add Impact',
    icon: TrendingUp,
    placeholder: 'e.g. Cut app startup time by 40% by lazy-loading feature modules',
    multiline: true,
  },
};

export const ToolForm: React.FC<{ name: ListField }> = ({ name }) => {
  const fields = useResumeStore((s) => s.resumeData[name]);
  const updateListField = useResumeStore((s) => s.updateListField);
  const { label, icon: EmptyIcon, placeholder, multiline } = LIST_CONFIG[name];

  const onAdd = () => updateListField(name, [...fields, '']);

  const onChange = (i: number, value: string) => {
    const next = [...fields];
    next[i] = value;
    updateListField(name, next);
  };

  return (
    <section>
      <AddButton onAdd={onAdd} label={label} />

      {fields.length === 0 ? (
        <EmptyState
          icon={EmptyIcon}
          message={`No ${name.toLowerCase()} added yet.`}
          actionLabel={label}
          onAction={onAdd}
        />
      ) : (
        <div className="form-card">
          <div className="form-card__body">
            {fields.map((item, i) => (
              // Key by index only: including the value remounts the input on
              // every keystroke and drops focus.
              <div key={`${name}-${i}`} className="form-skill-row">
                {multiline ? (
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder={placeholder}
                    value={item}
                    onChange={(e) => onChange(i, e.target.value)}
                  />
                ) : (
                  <input
                    className="form-input form-input-text"
                    placeholder={placeholder}
                    value={item}
                    onChange={(e) => onChange(i, e.target.value)}
                  />
                )}
                <button
                  type="button"
                  aria-label={`Remove ${name} item`}
                  onClick={() =>
                    updateListField(
                      name,
                      fields.filter((_, idx) => idx !== i),
                    )
                  }
                  className="form-skill-remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
