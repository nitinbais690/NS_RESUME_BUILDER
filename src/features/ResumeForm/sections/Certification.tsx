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
      <AddButton onAdd={onAdd} label="Add Certification" />

      {items.length === 0 ? (
        <div className="form-empty-state">
          No certifications added yet. Click “Add Certification” to get started.
        </div>
      ) : (
        items.map((cert, i) => (
          <FormCardWrapper
            key={cert.id}
            title="Certification"
            index={i + 1}
            onRemove={() => removeCertification(cert.id)}
          >
            <div className="form-input-group">
              <label className="form-label">Certification Name</label>
              <input
                placeholder="e.g. AWS Solutions Architect"
                className="form-input form-input-title"
                value={cert.name}
                onChange={(e) =>
                  updateCertification(cert.id, { name: e.target.value })
                }
              />
            </div>

            <div className="form-input-group">
              <label className="form-label">Issuing Organization</label>
              <input
                placeholder="e.g. Amazon Web Services"
                className="form-input"
                value={cert.issuer}
                onChange={(e) =>
                  updateCertification(cert.id, { issuer: e.target.value })
                }
              />
            </div>

            <div className="form-grid-2">
              <div className="form-input-group">
                <label className="form-label">Date</label>
                <input
                  placeholder="e.g. Jun 2024"
                  className="form-input"
                  value={cert.date}
                  onChange={(e) =>
                    updateCertification(cert.id, { date: e.target.value })
                  }
                />
              </div>
              <div className="form-input-group">
                <label className="form-label">Credential Link (Optional)</label>
                <input
                  placeholder="https://…"
                  className="form-input"
                  value={cert.link || ''}
                  onChange={(e) =>
                    updateCertification(cert.id, { link: e.target.value })
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

export default Certification;
