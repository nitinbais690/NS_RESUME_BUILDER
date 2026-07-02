import { ResumeField } from '../../../types';

import { FormCardWrapper } from '../common/FormCardWrapper';
import AddButton from '../common/AddButton';
import { TechTagInput } from '../common/TechTagInput';
import { useResumeStore } from '../../../store/useResumeStore';

const Experience: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.EXPERIENCE]);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);

  const onAdd = () =>
    addExperience({
      id: crypto.randomUUID(),
      title: '',
      company: '',
      date: '',
      desc: '',
      technologies: [],
    });

  return (
    <section>
      <AddButton onAdd={onAdd} />
      {items.map((exp) => (
        <FormCardWrapper key={exp.id} onRemove={() => removeExperience(exp.id)}>
          <div className="form-grid-2">
            <input
              placeholder="Title"
              className="form-input form-input-underline form-input-title"
              value={exp.title}
              onChange={(e) =>
                updateExperience(exp.id, { title: e.target.value })
              }
            />
            <input
              placeholder="Date Range"
              className="form-input form-input-meta"
              value={exp.date}
              onChange={(e) =>
                updateExperience(exp.id, { date: e.target.value })
              }
            />
          </div>
          <input
            placeholder="Company"
            className="form-input form-input-underline form-input-company"
            value={exp.company}
            onChange={(e) =>
              updateExperience(exp.id, { company: e.target.value })
            }
          />

          <TechTagInput
            tags={exp.technologies}
            onChange={(newTags) =>
              updateExperience(exp.id, { technologies: newTags })
            }
          />

          <textarea
            placeholder="Description"
            className="form-textarea"
            style={{ height: '80px', marginTop: '10px' }}
            value={exp.desc}
            onChange={(e) => updateExperience(exp.id, { desc: e.target.value })}
          />
        </FormCardWrapper>
      ))}
    </section>
  );
};

export default Experience;
