import { FolderCode } from 'lucide-react';

import { ResumeField } from '../../../types';
import { createProject } from '../../../constants/factories';
import { FormCardWrapper } from '../common/FormCardWrapper';
import { EmptyState } from '../common/EmptyState';
import { TechTagInput } from '../common/TechTagInput';
import AddButton from '../common/AddButton';
import { useResumeStore } from '../../../store/useResumeStore';

const Project: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.PROJECTS]);
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
        items.map((proj, i) => (
          <FormCardWrapper
            key={proj.id}
            title="Project"
            index={i + 1}
            onRemove={() => removeProject(proj.id)}
          >
            <div className="form-input-group">
              <label className="form-label">Project Name</label>
              <input
                placeholder="e.g. Portfolio Website"
                className="form-input form-input-title"
                value={proj.name}
                onChange={(e) =>
                  updateProject(proj.id, { name: e.target.value })
                }
              />
            </div>

            <div className="form-input-group">
              <label className="form-label">Link</label>
              <input
                placeholder="https://…"
                className="form-input"
                value={proj.link}
                onChange={(e) =>
                  updateProject(proj.id, { link: e.target.value })
                }
              />
            </div>

            <div className="form-input-group">
              <label className="form-label">Technologies</label>
              <TechTagInput
                tags={proj.technologies}
                onChange={(newTags) =>
                  updateProject(proj.id, { technologies: newTags })
                }
              />
            </div>

            <div className="form-input-group">
              <label className="form-label">Details</label>
              <textarea
                placeholder="What the project does"
                className="form-textarea form-textarea--short"
                value={proj.desc}
                onChange={(e) =>
                  updateProject(proj.id, { desc: e.target.value })
                }
              />
            </div>
          </FormCardWrapper>
        ))
      )}
    </section>
  );
};

export default Project;
