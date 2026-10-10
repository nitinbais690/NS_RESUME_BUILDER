import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  ContactInfo,
  ProjectType,
  ResumeData,
  ResumeField,
  ResumeStyle,
} from '../../types';
import ResumeHeader from './layout/ResumeHeader';
import { LAYOUT_CONFIG } from './layoutConfig';
import TimelineSection from './layout/TimeLine';
import { pickStyle, useResumeStore } from '../../store/useResumeStore';
import themes from '../../constants/themes';

// Section renderers — one per ResumeField variant
const AboutMeSection = ({ data }: { data: ResumeData }) => (
  <section className="template-main-section" data-jump={ResumeField.ABOUT_ME}>
    <h3 className="template-section-title">{ResumeField.ABOUT_ME}</h3>
    <p className="template-about-text">{data[ResumeField.ABOUT_ME]}</p>
  </section>
);

const KeyImpactSection = ({ data }: { data: ResumeData }) => (
  <section className="template-main-section" data-jump={ResumeField.KEY_IMPACT}>
    <h3 className="template-section-title">{ResumeField.KEY_IMPACT}</h3>
    <ul className="template-impact-list">
      {data[ResumeField.KEY_IMPACT].map((impact, i) =>
        impact ? (
          // data-jump-index keeps the original index so click-to-edit
          // lands on the right row even when empty rows are skipped.
          <li key={i} className="template-impact-item" data-jump-index={i}>
            {impact}
          </li>
        ) : null,
      )}
    </ul>
  </section>
);

const ToolsSection = ({ data }: { data: ResumeData }) => (
  <section className="template-sidebar-section" data-jump={ResumeField.TOOLS}>
    <h3 className="template-section-title">{ResumeField.TOOLS}</h3>
    <div className="template-tech-wrapper">
      {data[ResumeField.TOOLS].map((tool, i) => (
        <span key={`${tool}-${i}`} className="template-item-tech" data-jump-index={i}>
          {tool}
        </span>
      ))}
    </div>
  </section>
);

const SkillsSection = ({ data }: { data: ResumeData }) => (
  <section className="template-sidebar-section" data-jump={ResumeField.SKILLS}>
    <h3 className="template-section-title">{ResumeField.SKILLS}</h3>
    <div className="template-tech-wrapper">
      {data[ResumeField.SKILLS].map((skill, i) => (
        <span key={`${skill}-${i}`} className="template-item-tech" data-jump-index={i}>
          {skill}
        </span>
      ))}
    </div>
  </section>
);

const ExperienceSection = ({ data }: { data: ResumeData }) => (
  <TimelineSection
    title="Experience"
    field={ResumeField.EXPERIENCE}
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
    field={ResumeField.PROJECTS}
    items={data[ResumeField.PROJECTS].map((proj: ProjectType) => ({
      ...proj,
      id: proj.id.toString(),
      title: proj.name,
      description: proj.desc,
    }))}
  />
);

const EducationSection = ({ data }: { data: ResumeData }) => (
  <div className="template-sidebar-section" data-jump={ResumeField.EDUCATION}>
    <h3 className="template-section-title">{ResumeField.EDUCATION}</h3>
    {data[ResumeField.EDUCATION].map((edu) => (
      <div key={edu.id} className="template-credential-item" data-jump-id={edu.id}>
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
  <div className="template-sidebar-section" data-jump={ResumeField.CERTIFICATIONS}>
    <h3 className="template-section-title">{ResumeField.CERTIFICATIONS}</h3>
    {data[ResumeField.CERTIFICATIONS].map((cer) => (
      <div key={cer.id} className="template-credential-item" data-jump-id={cer.id}>
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

const LanguagesSection = ({ data }: { data: ResumeData }) => (
  <section className="template-sidebar-section" data-jump={ResumeField.LANGUAGES}>
    <h3 className="template-section-title">{ResumeField.LANGUAGES}</h3>
    <ul className="template-language-list">
      {data[ResumeField.LANGUAGES]
        .filter((l) => l.name.trim())
        .map((l) => (
          <li key={l.id} className="template-language-item" data-jump-id={l.id}>
            <span className="template-language-name">{l.name}</span>
            <span className="template-language-level">{l.level}</span>
          </li>
        ))}
    </ul>
  </section>
);

const AwardsSection = ({ data }: { data: ResumeData }) => (
  <div className="template-sidebar-section" data-jump={ResumeField.AWARDS}>
    <h3 className="template-section-title">{ResumeField.AWARDS}</h3>
    {data[ResumeField.AWARDS].map((a) => (
      <div key={a.id} className="template-credential-item" data-jump-id={a.id}>
        <div className="template-credential-header">
          <span className="template-credential-title">{a.title}</span>
          <span className="template-credential-date">{a.date}</span>
        </div>
        {a.issuer && <p className="template-credential-subtitle">{a.issuer}</p>}
        {a.desc && <p className="template-credential-desc">{a.desc}</p>}
      </div>
    ))}
  </div>
);

const VolunteeringSection = ({ data }: { data: ResumeData }) => (
  <TimelineSection
    title={ResumeField.VOLUNTEERING}
    field={ResumeField.VOLUNTEERING}
    items={data[ResumeField.VOLUNTEERING].map((v) => ({
      id: v.id,
      title: v.role,
      subtitle: v.org,
      date: v.date,
      description: v.desc,
    }))}
  />
);

// Optional sections stay off the page entirely until they have content.
const OPTIONAL_SECTIONS = new Set<ResumeField>([
  ResumeField.LANGUAGES,
  ResumeField.AWARDS,
  ResumeField.VOLUNTEERING,
]);

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
  [ResumeField.LANGUAGES]: LanguagesSection,
  [ResumeField.AWARDS]: AwardsSection,
  [ResumeField.VOLUNTEERING]: VolunteeringSection,
};

interface ResumeTemplateProps {
  /** Render this resume instead of the store's active one (share view, tests). */
  resume?: { data: ResumeData; style: ResumeStyle };
}

/** Inline CSS variables for a custom accent color and font scale. */
const styleVars = (style: ResumeStyle): React.CSSProperties => {
  const vars: Record<string, string> = {
    '--resume-font-scale': String(style.fontScale),
    '--resume-spacing-scale': String(style.spacingScale),
  };
  if (style.accentColor) {
    const c = style.accentColor;
    vars['--color-primary'] = c;
    vars['--color-primary-dark'] = `color-mix(in srgb, ${c} 85%, black)`;
    vars['--color-primary-soft'] = `color-mix(in srgb, ${c} 5%, transparent)`;
    vars['--color-primary-medium'] = `color-mix(in srgb, ${c} 10%, transparent)`;
    vars['--color-link'] = c;
  }
  return vars as React.CSSProperties;
};

const qrUrlFor = (data: ResumeData, target: ResumeStyle['qrTarget']) => {
  const contact = data[ResumeField.CONTACT];
  const raw =
    target === 'linkedin'
      ? contact[ContactInfo.LINKEDIN]
      : target === 'github'
        ? contact[ContactInfo.GITHUB]
        : '';
  if (!raw?.trim()) return undefined;
  return /^https?:\/\//i.test(raw) ? raw.trim() : `https://${raw.trim()}`;
};

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ resume }) => {
  const storeData = useResumeStore((s) => s.resumeData);
  const storeStyle = useResumeStore(useShallow(pickStyle));
  const data = resume?.data ?? storeData;
  const style = resume?.style ?? storeStyle;
  const { layout, theme, fontFamily } = style;
  const config = LAYOUT_CONFIG[layout];
  const accent =
    style.accentColor ??
    (themes.find((t) => t.name === theme) ?? themes[0]).color;

  const renderSection = (field: ResumeField) => {
    const Section = sectionRegistry[field];
    if (!Section || style.hiddenSections.includes(field)) return null;
    const items = data[field];
    if (OPTIONAL_SECTIONS.has(field) && Array.isArray(items) && items.length === 0) return null;
    return <Section key={field} data={data} />;
  };

  return (
    <div
      className="template-resume-outer-wrapper"
      style={{ fontFamily, ...styleVars(style) }}
      data-layout={layout}
      data-theme={theme}
    >
      <div className="template-resume-page">
        <ResumeHeader
          {...data[ResumeField.CONTACT]}
          accentColor={accent}
          qrUrl={qrUrlFor(data, style.qrTarget)}
        />

        <div key={layout} className="template-resume-body">
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
