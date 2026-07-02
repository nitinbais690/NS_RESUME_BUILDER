import { ResumeField } from '../../../types';

import { FormCardWrapper } from '../common/FormCardWrapper';
import AddButton from '../common/AddButton';
import { useResumeStore } from '../../../store/useResumeStore';

const Education: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.EDUCATION]);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);

  const onAdd = () =>
    addEducation({
      id: crypto.randomUUID(),
      degree: '',
      school: '',
      year: '',
      score: '',
    });

  return (
    <section>
      <AddButton onAdd={onAdd} label="Add Education" />

      {items.length === 0 ? (
        <div className="form-empty-state">
          No education added yet. Click “Add Education” to get started.
        </div>
      ) : (
        items.map((edu, i) => (
          <FormCardWrapper
            key={edu.id}
            title="Education"
            index={i + 1}
            onRemove={() => removeEducation(edu.id)}
          >
            <div className="form-input-group">
              <label className="form-label">Degree</label>
              <input
                placeholder="e.g. B.Sc. Computer Science"
                className="form-input form-input-title"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, { degree: e.target.value })
                }
              />
            </div>

            <div className="form-input-group">
              <label className="form-label">Institution</label>
              <input
                placeholder="School / University"
                className="form-input"
                value={edu.school}
                onChange={(e) =>
                  updateEducation(edu.id, { school: e.target.value })
                }
              />
            </div>

            <div className="form-grid-2">
              <div className="form-input-group">
                <label className="form-label">Score</label>
                <input
                  placeholder="e.g. 3.8 GPA"
                  className="form-input"
                  value={edu.score}
                  onChange={(e) =>
                    updateEducation(edu.id, { score: e.target.value })
                  }
                />
              </div>
              <div className="form-input-group">
                <label className="form-label">Year</label>
                <input
                  placeholder="e.g. 2019 – 2023"
                  className="form-input"
                  value={edu.year}
                  onChange={(e) =>
                    updateEducation(edu.id, { year: e.target.value })
                  }
                />
              </div>
            </div>
          </FormCardWrapper>
        ))
      )}
    </section>
  );
};

export default Education;
