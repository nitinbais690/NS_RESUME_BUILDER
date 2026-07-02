import { ResumeField, ContactInfo } from '../../../types';

import { FormField } from '../common/FormFields';
import { useResumeStore } from '../../../store/useResumeStore';

const PersonalDetails: React.FC = () => {
  const contact = useResumeStore((s) => s.resumeData[ResumeField.CONTACT]);
  const updateContactInfo = useResumeStore((s) => s.updateContactInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateContactInfo({ [e.target.name]: e.target.value });
  };

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
        <div className="full-width">
          <FormField
            label={ContactInfo.POSITION}
            name={ContactInfo.POSITION}
            value={contact[ContactInfo.POSITION]}
            onChange={handleChange}
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
          type="email"
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
        <FormField
          label={ContactInfo.LOCATION}
          name={ContactInfo.LOCATION}
          value={contact[ContactInfo.LOCATION]}
          onChange={handleChange}
        />
      </div>
    </section>
  );
};

export default PersonalDetails;
