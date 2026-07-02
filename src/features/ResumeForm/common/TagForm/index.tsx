import { ResumeField } from '../../../../types';
import { Trash2 } from 'lucide-react';
import AddButton from '../AddButton';
import { useResumeStore } from '../../../../store/useResumeStore';

export const ToolForm: React.FC<{
  name: ResumeField.SKILLS | ResumeField.TOOLS;
}> = ({ name }) => {
  const fields = useResumeStore((s) => s.resumeData[name]);
  const updateListField = useResumeStore((s) => s.updateListField);
  const label = name === ResumeField.SKILLS ? 'Add Skill' : 'Add Tool';

  const onAdd = () => updateListField(name, [...fields, '']);

  return (
    <section>
      <AddButton onAdd={onAdd} label={label} />

      {fields.length === 0 ? (
        <div className="form-empty-state">
          No {name.toLowerCase()} added yet. Click “{label}” to get started.
        </div>
      ) : (
        <div className="form-card">
          <div className="form-card__body">
            {fields.map((tool, i) => (
              <div key={i} className="form-skill-row">
                <input
                  className="form-input form-input-text"
                  value={tool}
                  onChange={(e) => {
                    const next = [...fields];
                    next[i] = e.target.value;
                    updateListField(name, next);
                  }}
                />
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
