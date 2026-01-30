import { ExperienceType, ResumeField } from '../../../types';
import { BaseFormProps } from '../types';

import { FormCardWrapper } from '../common/FormCardWrapper';
import AddButton from '../common/AddButton';
import { TechTagInput } from '../common/TechTagInput';

import { useFormArray } from '../hooks/useFormArray';

const Experience: React.FC<BaseFormProps> = ({ resumeData, setResumeData }) => {
  const { items, addItem, removeItem, updateItem } =
    useFormArray<ExperienceType>(
      resumeData,
      setResumeData,
      ResumeField.EXPERIENCE,
    );

  const onAdd = () =>
    addItem({
      id: Date.now().toString(),
      title: '',
      company: '',
      date: '',
      desc: '',
      technologies: [],
    });

  return (
    <section>
      <AddButton onAdd={onAdd} />
      {items.map((exp, i) => (
        <FormCardWrapper key={exp.id || i} onRemove={() => removeItem(i)}>
          <div className="form-grid-2">
            <input
              placeholder="Title"
              className="form-input form-input-underline form-input-title"
              value={exp.title}
              onChange={(e) => updateItem(i, { title: e.target.value })}
            />
            <input
              placeholder="Date Range"
              className="form-input form-input-meta"
              value={exp.date}
              onChange={(e) => updateItem(i, { date: e.target.value })}
            />
          </div>
          <input
            placeholder="Company"
            className="form-input form-input-underline form-input-company"
            value={exp.company}
            onChange={(e) => updateItem(i, { company: e.target.value })}
          />

          <TechTagInput
            tags={exp.technologies}
            onChange={(newTags) => updateItem(i, { technologies: newTags })}
          />

          <textarea
            placeholder="Description"
            className="form-textarea"
            style={{ height: '80px', marginTop: '10px' }}
            value={exp.desc}
            onChange={(e) => updateItem(i, { desc: e.target.value })}
          />
        </FormCardWrapper>
      ))}
    </section>
  );
};

export default Experience;
