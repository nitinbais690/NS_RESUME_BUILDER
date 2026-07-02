import { ResumeField } from '../../../../types';
import { Trash2 } from 'lucide-react';
import AddButton from '../AddButton';
import { useResumeStore } from '../../../../store/useResumeStore';

export const ToolForm: React.FC<{
  name: ResumeField.SKILLS | ResumeField.TOOLS;
}> = ({ name }) => {
  const fields = useResumeStore((s) => s.resumeData[name]);
  const updateListField = useResumeStore((s) => s.updateListField);

  const onAdd = () => updateListField(name, [...fields, '']);

  return (
    <section>
      <AddButton onAdd={onAdd} />
      <div className="form-card">
        {fields.map((tool, i) => (
          <div key={i} className="form-skill-row">
            <input
              className="form-input form-input-text"
              style={{ flex: 1 }}
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
                  fields.filter((_, idx) => idx !== i)
                )
              }
              className="form-btn-remove"
              style={{ position: 'static' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
