import React from 'react';
import { HeartHandshake } from 'lucide-react';

import { ResumeField } from '../../../types';
import { createVolunteer } from '../../../constants/factories';
import { FormCardWrapper } from '../common/FormCardWrapper';
import { SortableList } from '../common/Sortable';
import { EmptyState } from '../common/EmptyState';
import AddButton from '../common/AddButton';
import { AutoGrowTextarea } from '../common/FormFields';
import BulletHints from '../common/BulletHints';
import DateRangeField from '../common/DateRangeField';
import SortByDateButton from '../common/SortByDateButton';
import { useResumeStore } from '../../../store/useResumeStore';

const Volunteering: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.VOLUNTEERING]);
  const reorder = useResumeStore((s) => s.reorder);
  const addVolunteer = useResumeStore((s) => s.addVolunteer);
  const updateVolunteer = useResumeStore((s) => s.updateVolunteer);
  const removeVolunteer = useResumeStore((s) => s.removeVolunteer);
  const onAdd = () => addVolunteer(createVolunteer());

  return (
    <section>
      <AddButton onAdd={onAdd} label="Add Volunteering" />
      <SortByDateButton field={ResumeField.VOLUNTEERING} />
      {items.length === 0 ? (
        <EmptyState
          icon={HeartHandshake}
          message="No volunteering added yet."
          actionLabel="Add Volunteering"
          onAction={onAdd}
        />
      ) : (
        <SortableList
          ids={items.map((i) => i.id)}
          onMove={(from, to) => reorder(ResumeField.VOLUNTEERING, from, to)}
        >
          {items.map((v, i) => (
            <FormCardWrapper
              key={v.id}
              id={v.id}
              title="Volunteering"
              index={i + 1}
              onRemove={() => removeVolunteer(v.id)}
            >
              <div className="form-grid-2">
                <div className="form-input-group">
                  <label className="form-label" htmlFor={`${v.id}-role`}>
                    Role
                  </label>
                  <input
                    id={`${v.id}-role`}
                    className="form-input"
                    placeholder="e.g. Mentor"
                    value={v.role}
                    onChange={(e) => updateVolunteer(v.id, { role: e.target.value })}
                  />
                </div>
                <div className="form-input-group">
                  <label className="form-label" htmlFor={`${v.id}-org`}>
                    Organization
                  </label>
                  <input
                    id={`${v.id}-org`}
                    className="form-input"
                    placeholder="e.g. Code.org"
                    value={v.org}
                    onChange={(e) => updateVolunteer(v.id, { org: e.target.value })}
                  />
                </div>
              </div>
              <DateRangeField
                idPrefix={v.id}
                start={v.start}
                end={v.end}
                legacyText={v.start ? undefined : v.date}
                onChange={(range) => updateVolunteer(v.id, range)}
              />
              <div className="form-input-group">
                <label className="form-label" htmlFor={`${v.id}-desc`}>
                  What you did
                </label>
                <AutoGrowTextarea
                  id={`${v.id}-desc`}
                  className="form-textarea--short"
                  placeholder="e.g. Taught weekly coding classes to 25 students"
                  value={v.desc}
                  onChange={(e) => updateVolunteer(v.id, { desc: e.target.value })}
                />
                <BulletHints text={v.desc} mode="lines" />
              </div>
            </FormCardWrapper>
          ))}
        </SortableList>
      )}
    </section>
  );
};

export default Volunteering;
