import React from 'react';
import { Trophy } from 'lucide-react';

import { ResumeField } from '../../../types';
import { createAward } from '../../../constants/factories';
import { FormCardWrapper } from '../common/FormCardWrapper';
import { SortableList } from '../common/Sortable';
import { EmptyState } from '../common/EmptyState';
import AddButton from '../common/AddButton';
import { AutoGrowTextarea } from '../common/FormFields';
import { useResumeStore } from '../../../store/useResumeStore';

const Awards: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.AWARDS]);
  const reorder = useResumeStore((s) => s.reorder);
  const addAward = useResumeStore((s) => s.addAward);
  const updateAward = useResumeStore((s) => s.updateAward);
  const removeAward = useResumeStore((s) => s.removeAward);
  const onAdd = () => addAward(createAward());

  return (
    <section>
      <AddButton onAdd={onAdd} label="Add Award" />
      {items.length === 0 ? (
        <EmptyState icon={Trophy} message="No awards added yet." actionLabel="Add Award" onAction={onAdd} />
      ) : (
        <SortableList
          ids={items.map((i) => i.id)}
          onMove={(from, to) => reorder(ResumeField.AWARDS, from, to)}
        >
          {items.map((award, i) => (
            <FormCardWrapper
              key={award.id}
              id={award.id}
              title="Award"
              index={i + 1}
              onRemove={() => removeAward(award.id)}
            >
              <div className="form-input-group">
                <label className="form-label" htmlFor={`${award.id}-title`}>
                  Award
                </label>
                <input
                  id={`${award.id}-title`}
                  className="form-input form-input-title"
                  placeholder="e.g. Employee of the Year"
                  value={award.title}
                  onChange={(e) => updateAward(award.id, { title: e.target.value })}
                />
              </div>
              <div className="form-grid-2">
                <div className="form-input-group">
                  <label className="form-label" htmlFor={`${award.id}-issuer`}>
                    Given by
                  </label>
                  <input
                    id={`${award.id}-issuer`}
                    className="form-input"
                    placeholder="e.g. TechNova Labs"
                    value={award.issuer}
                    onChange={(e) => updateAward(award.id, { issuer: e.target.value })}
                  />
                </div>
                <div className="form-input-group">
                  <label className="form-label" htmlFor={`${award.id}-date`}>
                    Year
                  </label>
                  <input
                    id={`${award.id}-date`}
                    className="form-input"
                    placeholder="e.g. 2024"
                    value={award.date}
                    onChange={(e) => updateAward(award.id, { date: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-input-group">
                <label className="form-label" htmlFor={`${award.id}-desc`}>
                  Why you got it (optional)
                </label>
                <AutoGrowTextarea
                  id={`${award.id}-desc`}
                  rows={1}
                  placeholder="e.g. Top performer out of 300 engineers for shipping the payments revamp"
                  value={award.desc}
                  onChange={(e) => updateAward(award.id, { desc: e.target.value })}
                />
              </div>
            </FormCardWrapper>
          ))}
        </SortableList>
      )}
    </section>
  );
};

export default Awards;
