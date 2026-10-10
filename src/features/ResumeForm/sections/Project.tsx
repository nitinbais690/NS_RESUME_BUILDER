import { FolderCode } from 'lucide-react';

import { ResumeField } from '../../../types';
import { createProject } from '../../../constants/factories';
import { FormCardWrapper } from '../common/FormCardWrapper';
import { SortableList } from '../common/Sortable';
import BulletHints from '../common/BulletHints';
import { EmptyState } from '../common/EmptyState';
import { TechTagInput } from '../common/TechTagInput';
import AddButton from '../common/AddButton';
import { AutoGrowTextarea } from '../common/FormFields';
import { useResumeStore } from '../../../store/useResumeStore';

const Project: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.PROJECTS]);
  const reorder = useResumeStore((s) => s.reorder);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);

  const onAdd = () => addProject(createProject());

  return (
    <section>
      <AddButton onAdd={onAdd} label="Add Project" />

      {items.length === 0 ? (
        <EmptyState
          icon={FolderCode}
          message="No projects added yet."
          actionLabel="Add Project"
          onAction={onAdd}
        />
      ) : (
        <SortableList
          ids={items.map((item) => item.id)}
          onMove={(from, to) => reorder(ResumeField.PROJECTS, from, to)}
        >
          {items.map((proj, i) => (
            <FormCardWrapper
              key={proj.id}
              id={proj.id}
              title="Project"
              index={i + 1}
              onRemove={() => removeProject(proj.id)}
            >
              <div className="form-input-group">
                <label className="form-label" htmlFor={`${proj.id}-project-name`}>Project Name</label>
                <input
                  id={`${proj.id}-project-name`}
                  placeholder="e.g. Portfolio Website"
                  className="form-input form-input-title"
                  value={proj.name}
                  onChange={(e) =>
                    updateProject(proj.id, { name: e.target.value })
                  }
                />
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor={`${proj.id}-link`}>Link</label>
                <input
                  id={`${proj.id}-link`}
                  placeholder="https://…"
                  className="form-input"
                  value={proj.link}
                  onChange={(e) =>
                    updateProject(proj.id, { link: e.target.value })
                  }
                />
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor={`${proj.id}-technologies`}>Technologies</label>
                <TechTagInput
                  id={`${proj.id}-technologies`}
                  tags={proj.technologies}
                  onChange={(newTags) =>
                    updateProject(proj.id, { technologies: newTags })
                  }
                />
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor={`${proj.id}-details`}>Details</label>
                <AutoGrowTextarea
                  id={`${proj.id}-details`}
                  placeholder="What the project does"
                  className="form-textarea--short"
                  value={proj.desc}
                  onChange={(e) =>
                    updateProject(proj.id, { desc: e.target.value })
                  }
                />
                <BulletHints text={proj.desc} mode="lines" />
              </div>
            </FormCardWrapper>
          ))}
        </SortableList>
      )}
    </section>
  );
};

export default Project;
