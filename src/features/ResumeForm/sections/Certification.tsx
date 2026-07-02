import { ResumeField } from '../../../types';

import { FormCardWrapper } from '../common/FormCardWrapper';
import AddButton from '../common/AddButton';
import { useResumeStore } from '../../../store/useResumeStore';

const Certification: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.CERTIFICATIONS]);
  const addCertification = useResumeStore((s) => s.addCertification);
  const updateCertification = useResumeStore((s) => s.updateCertification);
  const removeCertification = useResumeStore((s) => s.removeCertification);

  const onAdd = () =>
    addCertification({
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
      link: '',
    });

  return (
    <section>
      <AddButton onAdd={onAdd} />
      {items.map((cert) => (
        <FormCardWrapper
          key={cert.id}
          onRemove={() => removeCertification(cert.id)}
        >
          <input
            placeholder="Certification Name"
            className="form-input form-input-underline form-input-title"
            value={cert.name}
            onChange={(e) =>
              updateCertification(cert.id, { name: e.target.value })
            }
          />
          <input
            placeholder="Issuing Organization"
            className="form-input form-input-underline form-input-text"
            value={cert.issuer}
            onChange={(e) =>
              updateCertification(cert.id, { issuer: e.target.value })
            }
          />
          <div className="flex gap-4">
            <input
              placeholder="Date"
              className="form-input form-input-meta"
              value={cert.date}
              onChange={(e) =>
                updateCertification(cert.id, { date: e.target.value })
              }
            />
            <input
              placeholder="Credential Link (Optional)"
              className="form-input form-input-meta"
              value={cert.link || ''}
              onChange={(e) =>
                updateCertification(cert.id, { link: e.target.value })
              }
            />
          </div>
        </FormCardWrapper>
      ))}
    </section>
  );
};

export default Certification;
