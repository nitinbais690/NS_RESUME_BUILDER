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
      <AddButton onAdd={onAdd} label="Add Experience" />

      {items.length === 0 ? (
        <div className="form-empty-state">
          No experience added yet. Click “Add Experience” to get started.
        </div>
      ) : (
        items.map((exp, i) => (
          <FormCardWrapper
            key={exp.id}
            title="Experience"
            index={i + 1}
            onRemove={() => removeExperience(exp.id)}
          >
            <div className="form-grid-2">
              <div className="form-input-group">
                <label className="form-label">Title</label>
                <input
                  placeholder="e.g. Senior Engineer"
                  className="form-input"
                  value={exp.title}
                  onChange={(e) =>
                    updateExperience(exp.id, { title: e.target.value })
                  }
                />
              </div>
              <div className="form-input-group">
                <label className="form-label">Date Range</label>
                <input
                  placeholder="e.g. 2021 – Present"
                  className="form-input"
                  value={exp.date}
                  onChange={(e) =>
                    updateExperience(exp.id, { date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-input-group">
              <label className="form-label">Company</label>
              <input
                placeholder="Company name"
                className="form-input form-input-company"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(exp.id, { company: e.target.value })
                }
              />
            </div>

            <div className="form-input-group">
              <label className="form-label">Technologies</label>
              <TechTagInput
                tags={exp.technologies}
                onChange={(newTags) =>
                  updateExperience(exp.id, { technologies: newTags })
                }
              />
            </div>

            <div className="form-input-group">
              <label className="form-label">Description</label>
              <textarea
                placeholder="What you did and achieved"
                className="form-textarea form-textarea--short"
                value={exp.desc}
                onChange={(e) =>
                  updateExperience(exp.id, { desc: e.target.value })
                }
              />
            </div>
          </FormCardWrapper>
        ))
      )}
    </section>
  );
};

export default Experience;
