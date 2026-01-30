import { BaseFormProps } from '../../types';

import { ResumeField } from '@/types';
import { Trash2 } from 'lucide-react';
import AddButton from '../AddButton';

export const ToolForm: React.FC<
  BaseFormProps & {
    name: ResumeField.SKILLS | ResumeField.TOOLS;
  }
> = ({ resumeData, setResumeData, name }) => {
  const fields = resumeData[name];
  const onAdd = () => setResumeData({ ...resumeData, [name]: [...fields, ''] });

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
                setResumeData({ ...resumeData, [name]: next });
              }}
            />
            <button
              onClick={() =>
                setResumeData({
                  ...resumeData,
                  [name]: fields.filter((_, idx) => idx !== i),
                })
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
