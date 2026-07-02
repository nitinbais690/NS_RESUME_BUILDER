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
      <AddButton onAdd={onAdd} />
      {items.map((edu) => (
        <FormCardWrapper key={edu.id} onRemove={() => removeEducation(edu.id)}>
          <input
            placeholder="Degree"
            className="form-input form-input-underline form-input-title"
            value={edu.degree}
            onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
          />
          <input
            placeholder="Institution"
            className="form-input form-input-underline form-input-text"
            value={edu.school}
            onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
          />
          <input
            placeholder="Score"
            className="form-input form-input-meta"
            value={edu.score}
            onChange={(e) => updateEducation(edu.id, { score: e.target.value })}
          />
          <input
            placeholder="Year"
            className="form-input form-input-meta"
            value={edu.year}
            onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
          />
        </FormCardWrapper>
      ))}
    </section>
  );
};

export default Education;
