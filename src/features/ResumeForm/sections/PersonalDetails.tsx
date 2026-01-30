import { ResumeField, ContactInfo } from '../../../types';
import { BaseFormProps } from '../types';

import { FormField } from '../common/FormFields';

const PersonalDetails: React.FC<BaseFormProps> = ({
  resumeData,
  setResumeData,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeData({
      ...resumeData,
      [ResumeField.CONTACT]: {
        ...resumeData[ResumeField.CONTACT],
        [e.target.name]: e.target.value,
      },
    });
  };

  const contact = resumeData[ResumeField.CONTACT] || {};

  return (
    <section>
      <div className="form-personal-details-grid">
        <div className="full-width">
          <FormField
            label={ContactInfo.NAME}
            name={ContactInfo.NAME}
            value={contact[ContactInfo.NAME]}
            onChange={handleChange}
            className="form-input-name"
          />
        </div>
        <FormField
          label={ContactInfo.PHONE}
          name={ContactInfo.PHONE}
          value={contact[ContactInfo.PHONE]}
          onChange={handleChange}
        />
        <FormField
          label={ContactInfo.EMAIL}
          name={ContactInfo.EMAIL}
          value={contact[ContactInfo.EMAIL]}
          onChange={handleChange}
        />
        <FormField
          label={ContactInfo.LINKEDIN}
          name={ContactInfo.LINKEDIN}
          value={contact[ContactInfo.LINKEDIN]}
          onChange={handleChange}
        />
        <FormField
          label={ContactInfo.GITHUB}
          name={ContactInfo.GITHUB}
          value={contact[ContactInfo.GITHUB]}
          onChange={handleChange}
        />
      </div>
    </section>
  );
};

export default PersonalDetails;
