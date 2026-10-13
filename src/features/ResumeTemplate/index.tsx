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
import Emphasis from './layout/Emphasis';
import { LAYOUT_CONFIG, layoutColumns, sectionTitle } from './layoutConfig';
import { LayoutContext } from './layoutContext';
import TimelineSection from './layout/TimeLine';
import { pickStyle, useResumeStore } from '../../store/useResumeStore';
import themes from '../../constants/themes';
import { splitSkillLabel } from '../../lib/emphasis';
import { displayRange } from '../../lib/dates';
import { profileHandle, withProtocol } from '../../lib/links';

interface SectionProps {
  data: ResumeData;
  /** Heading text; layouts may rename sections (e.g. "About Me" → "Summary"). */
  title: string;
  dateFormat?: ResumeStyle['dateFormat'];
}

// Section renderers — one per ResumeField variant
const AboutMeSection = ({ data, title }: SectionProps) => (
  <section className="template-main-section" data-jump={ResumeField.ABOUT_ME}>
    <h3 className="template-section-title">{title}</h3>
    <p className="template-about-text">
      <Emphasis text={data[ResumeField.ABOUT_ME]} />
    </p>
  </section>
);

const KeyImpactSection = ({ data, title }: SectionProps) => (
  <section className="template-main-section" data-jump={ResumeField.KEY_IMPACT}>
    <h3 className="template-section-title">{title}</h3>
    <ul className="template-impact-list">
      {data[ResumeField.KEY_IMPACT].map((impact, i) =>
        impact ? (
          // data-jump-index keeps the original index so click-to-edit
          // lands on the right row even when empty rows are skipped.
          <li key={i} className="template-impact-item" data-jump-index={i}>
            <Emphasis text={impact} />
          </li>
        ) : null,
      )}
    </ul>
  </section>
);

const ToolsSection = ({ data, title }: SectionProps) => (
  <section className="template-sidebar-section" data-jump={ResumeField.TOOLS}>
    <h3 className="template-section-title">{title}</h3>
    <div className="template-tech-wrapper">
      {data[ResumeField.TOOLS].map((tool, i) => (
        <span key={`${tool}-${i}`} className="template-item-tech" data-jump-index={i}>
          {tool}
        </span>
      ))}
    </div>
  </section>
);

const SkillsSection = ({ data, title }: SectionProps) => (
  <section className="template-sidebar-section" data-jump={ResumeField.SKILLS}>
    <h3 className="template-section-title">{title}</h3>
    <div className="template-tech-wrapper">
      {data[ResumeField.SKILLS].map((skill, i) => (
        <span key={`${skill}-${i}`} className="template-item-tech" data-jump-index={i}>
          {skill}
        </span>
      ))}
    </div>
  </section>
);

const ExperienceSection = ({ data, title, dateFormat }: SectionProps) => (
  <TimelineSection
    title={title}
    field={ResumeField.EXPERIENCE}
    items={data[ResumeField.EXPERIENCE].map((exp) => ({
      ...exp,
      date: displayRange(exp, dateFormat),
      subtitle: exp.company,
      description: exp.desc,
    }))}
  />
);

const ProjectsSection = ({ data, title }: SectionProps) => (
  <TimelineSection
    title={title}
    field={ResumeField.PROJECTS}
    items={data[ResumeField.PROJECTS].map((proj: ProjectType) => ({
      ...proj,
      id: proj.id.toString(),
      title: proj.name,
      description: proj.desc,
    }))}
  />
);

const EducationSection = ({ data, title }: SectionProps) => (
  <div className="template-sidebar-section" data-jump={ResumeField.EDUCATION}>
    <h3 className="template-section-title">{title}</h3>
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

const CertificationsSection = ({ data, title }: SectionProps) => (
  <div className="template-sidebar-section" data-jump={ResumeField.CERTIFICATIONS}>
    <h3 className="template-section-title">{title}</h3>
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
        {cer.desc && <p className="template-credential-desc">{cer.desc}</p>}
      </div>
    ))}
  </div>
);

const LanguagesSection = ({ data, title }: SectionProps) => (
  <section className="template-sidebar-section" data-jump={ResumeField.LANGUAGES}>
    <h3 className="template-section-title">{title}</h3>
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

const AwardsSection = ({ data, title }: SectionProps) => (
  <div className="template-sidebar-section" data-jump={ResumeField.AWARDS}>
    <h3 className="template-section-title">{title}</h3>
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

const VolunteeringSection = ({ data, title, dateFormat }: SectionProps) => (
  <TimelineSection
    title={title}
    field={ResumeField.VOLUNTEERING}
    items={data[ResumeField.VOLUNTEERING].map((v) => ({
      id: v.id,
      title: v.role,
      subtitle: v.org,
      date: displayRange(v, dateFormat),
      description: v.desc,
    }))}
  />
);

const CONTACT_ROWS: Array<{
  key: ContactInfo;
  label: string;
  href?: (v: string) => string;
  /** Profiles show just the user name; the link opens the full page. */
  text?: (v: string) => string;
}> = [
  { key: ContactInfo.EMAIL, label: 'Email', href: (v) => `mailto:${v}` },
  { key: ContactInfo.PHONE, label: 'Phone', href: (v) => `tel:${v}` },
  { key: ContactInfo.LINKEDIN, label: 'LinkedIn', href: withProtocol, text: profileHandle },
  { key: ContactInfo.GITHUB, label: 'GitHub', href: withProtocol, text: profileHandle },
  { key: ContactInfo.LOCATION, label: 'Location' },
];

/**
 * Contact details as labelled text lines ("Email: …") for layouts that put
 * them in a column. Plain text labels, no icons, so parsers can tag each one.
 */
const ContactSection = ({ data, title }: SectionProps) => {
  const contact = data[ResumeField.CONTACT];
  const rows = CONTACT_ROWS.filter((r) => contact[r.key]?.trim());
  if (rows.length === 0) return null;
  return (
    <section className="template-sidebar-section template-contact-section" data-jump={ResumeField.CONTACT}>
      <h3 className="template-section-title">{title}</h3>
      <ul className="template-contact-list">
        {rows.map((r) => {
          const value = contact[r.key]!.trim();
          return (
            <li key={r.key} className="template-contact-row">
              <span className="template-contact-label">{r.label}</span>
              {r.href ? (
                <a href={r.href(value)} target="_blank" rel="noopener noreferrer">
                  {r.text ? r.text(value) : value}
                </a>
              ) : (
                <span>{value}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

/**
 * Skills and Tools as labelled rows under one heading ("Skills: a, b, c"),
 * the dense format ATS-first layouts use instead of chips. Skills written as
 * "Category: a · b" become their own rows, labelled by that category.
 */
const InlineSkillsSection = ({
  data,
  title,
  showTools,
}: SectionProps & { showTools: boolean }) => {
  const skills = data[ResumeField.SKILLS].filter((i) => i.trim());
  const labelled = skills.map(splitSkillLabel);
  const plainSkills = skills.filter((_, i) => !labelled[i]);
  const rows = [
    ...labelled.flatMap((row, i) =>
      row ? [{ key: `skill-${i}`, field: ResumeField.SKILLS, label: row.label, text: row.items }] : [],
    ),
    ...(plainSkills.length > 0
      ? [{ key: 'skills', field: ResumeField.SKILLS, label: 'Skills', text: plainSkills.join(', ') }]
      : []),
    ...(showTools
      ? [{ key: 'tools', field: ResumeField.TOOLS, label: 'Tools', text: data[ResumeField.TOOLS].filter((i) => i.trim()).join(', ') }]
      : []),
  ].filter((row) => row.text);
  if (rows.length === 0) return null;
  return (
    <section className="template-main-section template-inline-skills" data-jump={ResumeField.SKILLS}>
      <h3 className="template-section-title">{title}</h3>
      {rows.map((row) => (
        <p key={row.key} className="template-inline-skills__row" data-jump={row.field}>
          <strong>{row.label}:</strong> {row.text}
        </p>
      ))}
    </section>
  );
};

// Optional sections stay off the page entirely until they have content.
const OPTIONAL_SECTIONS = new Set<ResumeField>([
  ResumeField.LANGUAGES,
  ResumeField.AWARDS,
  ResumeField.VOLUNTEERING,
]);

// Registry: ResumeField → section component
const sectionRegistry: Partial<Record<ResumeField, React.FC<SectionProps>>> = {
  [ResumeField.CONTACT]: ContactSection,
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
    '--resume-gap-section': String(style.gaps.section),
    '--resume-gap-heading': String(style.gaps.heading),
    '--resume-gap-entry': String(style.gaps.entry),
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
  return raw?.trim() ? withProtocol(raw) : undefined;
};

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ resume }) => {
  const storeData = useResumeStore((s) => s.resumeData);
  const storeStyle = useResumeStore(useShallow(pickStyle));
  const data = resume?.data ?? storeData;
  const style = resume?.style ?? storeStyle;
  const { layout, theme, fontFamily } = style;
  const config = LAYOUT_CONFIG[layout];
  const columns = layoutColumns(layout, style.sectionOrder);
  const accent =
    style.accentColor ??
    (themes.find((t) => t.name === theme) ?? themes[0]).color;

  const renderSection = (field: ResumeField) => {
    const Section = sectionRegistry[field];
    if (!Section || style.hiddenSections.includes(field)) return null;
    const items = data[field];
    if (OPTIONAL_SECTIONS.has(field) && Array.isArray(items) && items.length === 0) return null;
    if (config.inlineSkills && field === ResumeField.SKILLS) {
      return (
        <InlineSkillsSection
          key={field}
          data={data}
          title={sectionTitle(config, style, field, 'Technical Skills')}
          showTools={!style.hiddenSections.includes(ResumeField.TOOLS)}
        />
      );
    }
    return (
      <Section
        key={field}
        data={data}
        title={sectionTitle(config, style, field)}
        dateFormat={style.dateFormat}
      />
    );
  };

  return (
    // Context lets deep renderers (timeline entries) follow the layout's options.
    <LayoutContext.Provider value={config}>
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
            hideContacts={config.contactInColumn}
            variant={config.headerStyle}
          />

          <div key={layout} className="template-resume-body">
            <aside className="template-left-column">
              {columns.left.map((field) => renderSection(field))}
            </aside>

            <main className="template-right-column">
              {columns.right.map((field) => renderSection(field))}
            </main>
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default ResumeTemplate;
