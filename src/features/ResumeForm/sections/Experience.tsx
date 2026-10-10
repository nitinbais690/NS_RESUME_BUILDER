import { Briefcase } from 'lucide-react';

import { ResumeField } from '../../../types';
import { createExperience } from '../../../constants/factories';
import { FormCardWrapper } from '../common/FormCardWrapper';
import { SortableList } from '../common/Sortable';
import BulletHints from '../common/BulletHints';
import DateRangeField from '../common/DateRangeField';
import SortByDateButton from '../common/SortByDateButton';
import { EmptyState } from '../common/EmptyState';
import { TechTagInput } from '../common/TechTagInput';
import AddButton from '../common/AddButton';
import { AutoGrowTextarea } from '../common/FormFields';
import { useResumeStore } from '../../../store/useResumeStore';

const Experience: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.EXPERIENCE]);
  const reorder = useResumeStore((s) => s.reorder);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);

  const onAdd = () => addExperience(createExperience());

  return (
    <section>
      <AddButton onAdd={onAdd} label="Add Experience" />
      <SortByDateButton field={ResumeField.EXPERIENCE} />

      {items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          message="No experience added yet."
          actionLabel="Add Experience"
          onAction={onAdd}
        />
      ) : (
        <SortableList
          ids={items.map((item) => item.id)}
          onMove={(from, to) => reorder(ResumeField.EXPERIENCE, from, to)}
        >
          {items.map((exp, i) => (
            <FormCardWrapper
              key={exp.id}
              id={exp.id}
              title="Experience"
              index={i + 1}
              onRemove={() => removeExperience(exp.id)}
            >
              <div className="form-input-group">
                <label className="form-label" htmlFor={`${exp.id}-title`}>Title</label>
                <input
                  id={`${exp.id}-title`}
                  placeholder="e.g. Senior Engineer"
                  className="form-input"
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                />
              </div>

              <DateRangeField
                idPrefix={exp.id}
                start={exp.start}
                end={exp.end}
                legacyText={exp.start ? undefined : exp.date}
                onChange={(range) => updateExperience(exp.id, range)}
              />

              <div className="form-input-group">
                <label className="form-label" htmlFor={`${exp.id}-company`}>Company</label>
                <input
                  id={`${exp.id}-company`}
                  placeholder="Company name"
                  className="form-input form-input-company"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, { company: e.target.value })
                  }
                />
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor={`${exp.id}-technologies`}>Technologies</label>
                <TechTagInput
                  id={`${exp.id}-technologies`}
                  tags={exp.technologies}
                  onChange={(newTags) =>
                    updateExperience(exp.id, { technologies: newTags })
                  }
                />
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor={`${exp.id}-description`}>Description</label>
                <AutoGrowTextarea
                  id={`${exp.id}-description`}
                  placeholder="What you did and achieved"
                  className="form-textarea--short"
                  value={exp.desc}
                  onChange={(e) =>
                    updateExperience(exp.id, { desc: e.target.value })
                  }
                />
                <BulletHints text={exp.desc} mode="lines" />
              </div>
            </FormCardWrapper>
          ))}
        </SortableList>
      )}
    </section>
  );
};

export default Experience;
