import { GraduationCap } from 'lucide-react';

import { ResumeField } from '../../../types';
import { createEducation } from '../../../constants/factories';
import { FormCardWrapper } from '../common/FormCardWrapper';
import { SortableList } from '../common/Sortable';
import { EmptyState } from '../common/EmptyState';
import AddButton from '../common/AddButton';
import { useResumeStore } from '../../../store/useResumeStore';

const Education: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.EDUCATION]);
  const reorder = useResumeStore((s) => s.reorder);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);

  const onAdd = () => addEducation(createEducation());

  return (
    <section>
      <AddButton onAdd={onAdd} label="Add Education" />

      {items.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          message="No education added yet."
          actionLabel="Add Education"
          onAction={onAdd}
        />
      ) : (
        <SortableList
          ids={items.map((item) => item.id)}
          onMove={(from, to) => reorder(ResumeField.EDUCATION, from, to)}
        >
          {items.map((edu, i) => (
            <FormCardWrapper
              key={edu.id}
              id={edu.id}
              title="Education"
              index={i + 1}
              onRemove={() => removeEducation(edu.id)}
            >
              <div className="form-input-group">
                <label className="form-label" htmlFor={`${edu.id}-degree`}>Degree</label>
                <input
                  id={`${edu.id}-degree`}
                  placeholder="e.g. B.Sc. Computer Science"
                  className="form-input form-input-title"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, { degree: e.target.value })
                  }
                />
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor={`${edu.id}-institution`}>Institution</label>
                <input
                  id={`${edu.id}-institution`}
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
                  <label className="form-label" htmlFor={`${edu.id}-score`}>Score</label>
                  <input
                    id={`${edu.id}-score`}
                    placeholder="e.g. 3.8 GPA"
                    className="form-input"
                    value={edu.score}
                    onChange={(e) =>
                      updateEducation(edu.id, { score: e.target.value })
                    }
                  />
                </div>
                <div className="form-input-group">
                  <label className="form-label" htmlFor={`${edu.id}-year`}>Year</label>
                  <input
                    id={`${edu.id}-year`}
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
          ))}
        </SortableList>
      )}
    </section>
  );
};

export default Education;
