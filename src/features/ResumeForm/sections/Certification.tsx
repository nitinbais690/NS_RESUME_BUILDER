import { Award } from 'lucide-react';

import { ResumeField } from '../../../types';
import { createCertification } from '../../../constants/factories';
import { FormCardWrapper } from '../common/FormCardWrapper';
import { SortableList } from '../common/Sortable';
import { EmptyState } from '../common/EmptyState';
import AddButton from '../common/AddButton';
import { AutoGrowTextarea } from '../common/FormFields';
import { useResumeStore } from '../../../store/useResumeStore';

const Certification: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.CERTIFICATIONS]);
  const reorder = useResumeStore((s) => s.reorder);
  const addCertification = useResumeStore((s) => s.addCertification);
  const updateCertification = useResumeStore((s) => s.updateCertification);
  const removeCertification = useResumeStore((s) => s.removeCertification);

  const onAdd = () => addCertification(createCertification());

  return (
    <section>
      <AddButton onAdd={onAdd} label="Add Certification" />

      {items.length === 0 ? (
        <EmptyState
          icon={Award}
          message="No certifications added yet."
          actionLabel="Add Certification"
          onAction={onAdd}
        />
      ) : (
        <SortableList
          ids={items.map((item) => item.id)}
          onMove={(from, to) => reorder(ResumeField.CERTIFICATIONS, from, to)}
        >
          {items.map((cert, i) => (
            <FormCardWrapper
              key={cert.id}
              id={cert.id}
              title="Certification"
              index={i + 1}
              onRemove={() => removeCertification(cert.id)}
            >
              <div className="form-input-group">
                <label className="form-label" htmlFor={`${cert.id}-certification-name`}>Certification Name</label>
                <input
                  id={`${cert.id}-certification-name`}
                  placeholder="e.g. AWS Solutions Architect"
                  className="form-input form-input-title"
                  value={cert.name}
                  onChange={(e) =>
                    updateCertification(cert.id, { name: e.target.value })
                  }
                />
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor={`${cert.id}-issuing-organization`}>Issuing Organization</label>
                <input
                  id={`${cert.id}-issuing-organization`}
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
                  <label className="form-label" htmlFor={`${cert.id}-date`}>Date</label>
                  <input
                    id={`${cert.id}-date`}
                    placeholder="e.g. Jun 2024"
                    className="form-input"
                    value={cert.date}
                    onChange={(e) =>
                      updateCertification(cert.id, { date: e.target.value })
                    }
                  />
                </div>
                <div className="form-input-group">
                  <label className="form-label" htmlFor={`${cert.id}-credential-link-optional`}>Credential Link (Optional)</label>
                  <input
                    id={`${cert.id}-credential-link-optional`}
                    placeholder="https://…"
                    className="form-input"
                    value={cert.link || ''}
                    onChange={(e) =>
                      updateCertification(cert.id, { link: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor={`${cert.id}-desc`}>
                  Skills gained or project built (optional)
                </label>
                <AutoGrowTextarea
                  id={`${cert.id}-desc`}
                  rows={1}
                  placeholder="e.g. Designed serverless APIs with Lambda and DynamoDB"
                  value={cert.desc || ''}
                  onChange={(e) => updateCertification(cert.id, { desc: e.target.value })}
                />
              </div>
            </FormCardWrapper>
          ))}
        </SortableList>
      )}
    </section>
  );
};

export default Certification;
