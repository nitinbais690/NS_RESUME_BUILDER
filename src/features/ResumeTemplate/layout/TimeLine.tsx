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
  items: Array<TimelineSectionItemProps>;
}

const TimelineItem: React.FC<TimelineSectionItemProps> = ({
  title,
  date,
  subtitle,
  description,
  link,
  technologies,
}) => (
  <div className="template-timeline-item">
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
      >
        {link}
      </a>
    )}
    <div className="template-item-desc">{description}</div>
    {technologies && technologies.length > 0 && (
      <div className="template-tech-wrapper">
        <span className="template-tech-label">Technologies:</span>
        {technologies.map((tech: string, idx: number) => (
          <span key={idx} className="template-item-tech">
            {tech}
          </span>
        ))}
      </div>
    )}
  </div>
);

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  title,
  items,
}) => (
  <div className="template-timeline-section">
    <h3 className="template-section-title">{title}</h3>
    <div className="template-timeline-track">
      {items.map((item: TimelineSectionItemProps) => (
        <TimelineItem key={item.id} {...item} />
      ))}
    </div>
  </div>
);

export default TimelineSection;
