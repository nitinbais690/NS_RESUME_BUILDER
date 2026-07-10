import { ProjectType, ResumeData, ResumeField } from '../../types';
import ResumeHeader from './layout/ResumeHeader';
import { LAYOUT_CONFIG } from './layoutConfig';
import TimelineSection from './layout/TimeLine';
import { useResumeStore } from '../../store/useResumeStore';

// Section renderers — one per ResumeField variant
const AboutMeSection = ({ data }: { data: ResumeData }) => (
  <section className="template-main-section">
    <h3 className="template-section-title">{ResumeField.ABOUT_ME}</h3>
    <p className="template-about-text">{data[ResumeField.ABOUT_ME]}</p>
  </section>
);

const KeyImpactSection = ({ data }: { data: ResumeData }) => (
  <section className="template-main-section">
    <h3 className="template-section-title">{ResumeField.KEY_IMPACT}</h3>
    <ul className="template-impact-list">
      {data[ResumeField.KEY_IMPACT].map((impact) => (
        <li key={impact} className="template-impact-item">
          {impact}
        </li>
      ))}
    </ul>
  </section>
);

const ToolsSection = ({ data }: { data: ResumeData }) => (
  <section className="template-sidebar-section">
    <h3 className="template-section-title">{ResumeField.TOOLS}</h3>
    <div className="template-tech-wrapper">
      {data[ResumeField.TOOLS].map((tool) => (
        <span key={tool} className="template-item-tech">
          {tool}
        </span>
      ))}
    </div>
  </section>
);

const SkillsSection = ({ data }: { data: ResumeData }) => (
  <section className="template-sidebar-section">
    <h3 className="template-section-title">{ResumeField.SKILLS}</h3>
    <div className="template-tech-wrapper">
      {data[ResumeField.SKILLS].map((skill) => (
        <span key={skill} className="template-item-tech">
          {skill}
        </span>
      ))}
    </div>
  </section>
);

const ExperienceSection = ({ data }: { data: ResumeData }) => (
  <TimelineSection
    title="Experience"
    items={data[ResumeField.EXPERIENCE].map((exp) => ({
      ...exp,
      subtitle: exp.company,
      description: exp.desc,
    }))}
  />
);

const ProjectsSection = ({ data }: { data: ResumeData }) => (
  <TimelineSection
    title={ResumeField.PROJECTS}
    items={data[ResumeField.PROJECTS].map((proj: ProjectType) => ({
      ...proj,
      id: proj.id.toString(),
      title: proj.name,
      description: proj.desc,
    }))}
  />
);

const EducationSection = ({ data }: { data: ResumeData }) => (
  <div className="template-sidebar-section">
    <h3 className="template-section-title">{ResumeField.EDUCATION}</h3>
    {data[ResumeField.EDUCATION].map((edu) => (
      <div key={edu.id} className="template-credential-item">
        <div className="template-credential-header">
          <span className="template-credential-title">{edu.degree}</span>
          <div className="template-credential-meta-wrapper">
            {edu.score && (
              <span className="template-credential-score">{edu.score}</span>
            )}
            <span className="template-credential-year">{edu.year}</span>
          </div>
        </div>
        <p className="template-credential-subtitle">{edu.school}</p>
      </div>
    ))}
  </div>
);

const CertificationsSection = ({ data }: { data: ResumeData }) => (
  <div className="template-sidebar-section">
    <h3 className="template-section-title">{ResumeField.CERTIFICATIONS}</h3>
    {data[ResumeField.CERTIFICATIONS].map((cer) => (
      <div key={cer.id} className="template-credential-item">
        <div className="template-credential-header">
          <span className="template-credential-title">{cer.name}</span>
          <span className="template-credential-date">{cer.date}</span>
        </div>
        <p className="template-credential-subtitle">
          {cer.issuer}
          {cer.link && (
            <a
              href={cer.link}
              target="_blank"
              rel="noreferrer"
              className="template-credential-link"
            >
              {' '}View credential
            </a>
          )}
        </p>
      </div>
    ))}
  </div>
);

// Registry: ResumeField → section component
const sectionRegistry: Partial<
  Record<ResumeField, React.FC<{ data: ResumeData }>>
> = {
  [ResumeField.ABOUT_ME]: AboutMeSection,
  [ResumeField.KEY_IMPACT]: KeyImpactSection,
  [ResumeField.TOOLS]: ToolsSection,
  [ResumeField.SKILLS]: SkillsSection,
  [ResumeField.EXPERIENCE]: ExperienceSection,
  [ResumeField.PROJECTS]: ProjectsSection,
  [ResumeField.EDUCATION]: EducationSection,
  [ResumeField.CERTIFICATIONS]: CertificationsSection,
};

const ResumeTemplate: React.FC = () => {
  const data = useResumeStore((s) => s.resumeData);
  const layout = useResumeStore((s) => s.layout);
  const theme = useResumeStore((s) => s.theme);
  const fontFamily = useResumeStore((s) => s.fontFamily);
  const config = LAYOUT_CONFIG[layout];

  const renderSection = (field: ResumeField) => {
    const Section = sectionRegistry[field];
    return Section ? <Section key={field} data={data} /> : null;
  };

  return (
    <div
      className="template-resume-outer-wrapper"
      style={{ fontFamily }}
      data-layout={layout}
      data-theme={theme}
    >
      <div className="template-resume-page">
        <ResumeHeader {...data[ResumeField.CONTACT]} currentTheme={theme} />

        <div className="template-resume-body">
          <aside className="template-left-column">
            {config.left?.map((field) => renderSection(field))}
          </aside>

          <main className="template-right-column">
            {config.right?.map((field) => renderSection(field))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;
