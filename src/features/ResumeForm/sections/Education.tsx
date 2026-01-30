import { ResumeField, EducationType } from '../../../types';
import { BaseFormProps } from '../types';

import React from 'react';

import { FormCardWrapper } from '../common/FormCardWrapper';
import AddButton from '../common/AddButton';

import { useFormArray } from '../hooks/useFormArray';

const Education: React.FC<BaseFormProps> = ({ resumeData, setResumeData }) => {
  const { items, addItem, removeItem, updateItem } =
    useFormArray<EducationType>(
      resumeData,
      setResumeData,
      ResumeField.EDUCATION,
    );

  const onAdd = () =>
    addItem({
      id: Date.now().toString(),
      degree: '',
      school: '',
      year: '',
      score: '',
    });

  return (
    <section>
      <AddButton onAdd={onAdd} />
      {items.map((edu, i) => (
        <FormCardWrapper key={edu.id || i} onRemove={() => removeItem(i)}>
          <input
            placeholder="Degree"
            className="form-input form-input-underline form-input-title"
            value={edu.degree}
            onChange={(e) => updateItem(i, { degree: e.target.value })}
          />
          <input
            placeholder="Institution"
            className="form-input form-input-underline form-input-text"
            value={edu.school}
            onChange={(e) => updateItem(i, { school: e.target.value })}
          />
          <input
            placeholder="Score"
            className="form-input form-input-meta"
            value={edu.year}
            onChange={(e) => updateItem(i, { year: e.target.value })}
          />
          <input
            placeholder="Year"
            className="form-input form-input-meta"
            value={edu.year}
            onChange={(e) => updateItem(i, { year: e.target.value })}
          />
        </FormCardWrapper>
      ))}
    </section>
  );
};

export default Education;
