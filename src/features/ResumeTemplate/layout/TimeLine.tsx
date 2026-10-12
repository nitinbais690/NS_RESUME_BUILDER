import { useLayoutConfig } from '../layoutContext';
import { stripBulletMarker } from '../../../lib/bulletLint';
import Emphasis from './Emphasis';

/** "https://github.com/x/y/" → "github.com/x/y": the readable part ATS keep. */
const displayUrl = (url: string) =>
  url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');

const TechList: React.FC<{ technologies?: string[] }> = ({ technologies }) =>
  technologies && technologies.length > 0 ? (
    <div className="template-tech-wrapper">
      <span className="template-tech-label">Technologies:</span>
      {technologies.map((tech: string) => (
        <span key={tech} className="template-item-tech">
          {tech}
        </span>
      ))}
    </div>
  ) : null;

/**
 * Description as a real list when it has several lines or starts with a
 * bullet marker ("• Led…"), so wrapped lines hang-indent and each layout picks
 * its own bullet; a single plain sentence stays a paragraph.
 */
const Description: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n').filter((l) => l.trim());
  const isList = lines.length > 1 || /^\s*(?:[•\-–*·▪]|\d+[.)])\s/.test(lines[0] ?? '');
  if (!isList) {
    return (
      <div className="template-item-desc">
        <Emphasis text={text.trim()} />
      </div>
    );
  }
  return (
    <ul className="template-item-desc template-item-bullets">
      {lines.map((line, i) => (
        <li key={i}>
          <Emphasis text={stripBulletMarker(line)} />
        </li>
      ))}
    </ul>
  );
};

const ProjectLink: React.FC<{ link?: string }> = ({ link }) =>
  link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="template-project-link">
      {displayUrl(link)}
    </a>
  ) : null;

interface TimelineSectionItemProps {
  id: string;
  title: string;
  date?: string;
  subtitle?: string;
  description: string;
  link?: string;
  technologies?: string[];
}

interface TimelineSectionProps {
  title: string;
  /** ResumeField this section renders; enables click-to-edit in the preview. */
  field?: string;
  items: Array<TimelineSectionItemProps>;
}

const TimelineItem: React.FC<TimelineSectionItemProps> = ({
  id,
  title,
  date,
  subtitle,
  description,
  link,
  technologies,
}) => {
  const { entryStyle } = useLayoutConfig();
  const dateEl = date && <span className="template-item-date">{date}</span>;
  const body = (
    <>
      <Description text={description} />
      <TechList technologies={technologies} />
    </>
  );

  // Every variant keeps reading order: title/company/link first, date last.
  if (entryStyle === 'inline') {
    return (
      <div className="template-timeline-item" data-jump-id={id} data-entry="inline">
        <div className="template-item-header">
          <div className="template-item-heading">
            <h2 className="template-item-title">{title}</h2>
            {subtitle && <span className="template-item-subtitle">{subtitle}</span>}
            <ProjectLink link={link} />
          </div>
          {dateEl}
        </div>
        {body}
      </div>
    );
  }

  if (entryStyle === 'stacked') {
    return (
      <div className="template-timeline-item" data-jump-id={id} data-entry="stacked">
        <h2 className="template-item-title">{title}</h2>
        {(subtitle || link || date) && (
          <div className="template-item-meta">
            {subtitle && <span className="template-item-subtitle">{subtitle}</span>}
            <ProjectLink link={link} />
            {dateEl}
          </div>
        )}
        {body}
      </div>
    );
  }

  if (entryStyle === 'org-first') {
    // Without an organization (projects), the title leads the first line.
    return (
      <div className="template-timeline-item" data-jump-id={id} data-entry="org-first">
        {subtitle ? (
          <>
            <div className="template-item-header">
              <h2 className="template-item-org">{subtitle}</h2>
              <ProjectLink link={link} />
            </div>
            <div className="template-item-header">
              <span className="template-item-role">{title}</span>
              {dateEl}
            </div>
          </>
        ) : (
          <div className="template-item-header">
            <div className="template-item-heading">
              <h2 className="template-item-title">{title}</h2>
              <ProjectLink link={link} />
            </div>
            {dateEl}
          </div>
        )}
        {body}
      </div>
    );
  }

  return (
    <div className="template-timeline-item" data-jump-id={id}>
      <div className="template-timeline-marker" />
      <div className="template-item-header">
        <h2 className="template-item-title">{title}</h2>
        {date && <span className="template-item-date">{date}</span>}
      </div>
      {subtitle && <div className="template-item-subtitle">{subtitle}</div>}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="template-project-link"
          aria-label={`View project: ${title}`}
        >
          View Project ↗
        </a>
      )}
      <div className="template-item-desc">
        <Emphasis text={description} />
      </div>
      <TechList technologies={technologies} />
    </div>
  );
};

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  title,
  field,
  items,
}) => (
  <div className="template-timeline-section" data-jump={field}>
    <h3 className="template-section-title">{title}</h3>
    <div className="template-timeline-track">
      {items.map((item: TimelineSectionItemProps) => (
        <TimelineItem key={item.id} {...item} />
      ))}
    </div>
  </div>
);

export default TimelineSection;
