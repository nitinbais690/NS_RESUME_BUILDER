import { ResumeField, CertificationType } from '../../../types';
import { BaseFormProps } from '../types';

import React from 'react';

import { FormCardWrapper } from '../common/FormCardWrapper';
import AddButton from '../common/AddButton';

import { useFormArray } from '../hooks/useFormArray';

const Certification: React.FC<BaseFormProps> = ({
  resumeData,
  setResumeData,
}) => {
  const { items, addItem, removeItem, updateItem } =
    useFormArray<CertificationType>(
      resumeData,
      setResumeData,
      ResumeField.CERTIFICATIONS,
    );

  const onAdd = () =>
    addItem({
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      link: '',
    });

  return (
    <section>
      <AddButton onAdd={onAdd} />
      {items.map((cert, i) => (
        <FormCardWrapper key={cert.id || i} onRemove={() => removeItem(i)}>
          <input
            placeholder="Certification Name"
            className="form-input form-input-underline form-input-title"
            value={cert.name}
            onChange={(e) => updateItem(i, { name: e.target.value })}
          />
          <input
            placeholder="Issuing Organization"
            className="form-input form-input-underline form-input-text"
            value={cert.issuer}
            onChange={(e) => updateItem(i, { issuer: e.target.value })}
          />
          <div className="flex gap-4">
            <input
              placeholder="Date"
              className="form-input form-input-meta"
              value={cert.date}
              onChange={(e) => updateItem(i, { date: e.target.value })}
            />
            <input
              placeholder="Credential Link (Optional)"
              className="form-input form-input-meta"
              value={cert.link || ''}
              onChange={(e) => updateItem(i, { link: e.target.value })}
            />
          </div>
        </FormCardWrapper>
      ))}
    </section>
  );
};

export default Certification;
