import { ResumeField } from '../../../types';

import { FormCardWrapper } from '../common/FormCardWrapper';
import { TechTagInput } from '../common/TechTagInput';
import AddButton from '../common/AddButton';
import { useResumeStore } from '../../../store/useResumeStore';

const Project: React.FC = () => {
  const items = useResumeStore((s) => s.resumeData[ResumeField.PROJECTS]);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);

  const onAdd = () =>
    addProject({
      id: crypto.randomUUID(),
      name: '',
      link: '',
      desc: '',
      technologies: [],
    });

  return (
    <section>
      <AddButton onAdd={onAdd} />
      {items.map((proj) => (
        <FormCardWrapper key={proj.id} onRemove={() => removeProject(proj.id)}>
          <input
            placeholder="Project Name"
            className="form-input form-input-underline form-input-title"
            value={proj.name}
            onChange={(e) => updateProject(proj.id, { name: e.target.value })}
          />
          <input
            placeholder="Link"
            className="form-input form-input-underline form-input-link"
            value={proj.link}
            onChange={(e) => updateProject(proj.id, { link: e.target.value })}
          />

          <TechTagInput
            tags={proj.technologies}
            onChange={(newTags) =>
              updateProject(proj.id, { technologies: newTags })
            }
          />

          <textarea
            placeholder="Details"
            className="form-textarea"
            style={{ height: '80px', marginTop: '10px' }}
            value={proj.desc}
            onChange={(e) => updateProject(proj.id, { desc: e.target.value })}
          />
        </FormCardWrapper>
      ))}
    </section>
  );
};

export default Project;
