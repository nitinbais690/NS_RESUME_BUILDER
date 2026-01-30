import { ProjectType, ResumeField } from '../../../types';
import { BaseFormProps } from '../types';

import { FormCardWrapper } from '../common/FormCardWrapper';
import { TechTagInput } from '../common/TechTagInput';

import { useFormArray } from '../hooks/useFormArray';
import AddButton from '../common/AddButton';

const Project: React.FC<BaseFormProps> = ({ resumeData, setResumeData }) => {
  const { items, addItem, removeItem, updateItem } = useFormArray<ProjectType>(
    resumeData,
    setResumeData,
    ResumeField.PROJECTS,
  );

  const onAdd = () =>
    addItem({
      id: Date.now().toString(),
      name: '',
      link: '',
      desc: '',
      technologies: [],
    });

  return (
    <section>
      <AddButton onAdd={onAdd} />
      {items.map((proj, i) => (
        <FormCardWrapper key={proj.id || i} onRemove={() => removeItem(i)}>
          <input
            placeholder="Project Name"
            className="form-input form-input-underline form-input-title"
            value={proj.name}
            onChange={(e) => updateItem(i, { name: e.target.value })}
          />
          <input
            placeholder="Link"
            className="form-input form-input-underline form-input-link"
            value={proj.link}
            onChange={(e) => updateItem(i, { link: e.target.value })}
          />

          <TechTagInput
            tags={proj.technologies}
            onChange={(newTags) => updateItem(i, { technologies: newTags })}
          />

          <textarea
            placeholder="Details"
            className="form-textarea"
            style={{ height: '80px', marginTop: '10px' }}
            value={proj.desc}
            onChange={(e) => updateItem(i, { desc: e.target.value })}
          />
        </FormCardWrapper>
      ))}
    </section>
  );
};

export default Project;
