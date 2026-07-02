import { X } from 'lucide-react';

interface TechTagProps {
  tags: string[];
  onChange: (newTags: string[]) => void;
}

export const TechTagInput = ({ tags = [], onChange }: TechTagProps) => (
  <div className="tech-tags">
    {tags.length > 0 && (
      <div className="tech-tags-container">
        {tags.map((tech, tIndex) => (
          <span key={tech} className="tech-tag-edit">
            {tech}
            <button
              type="button"
              aria-label={`Remove ${tech}`}
              className="tech-tag-remove"
              onClick={() => onChange(tags.filter((_, idx) => idx !== tIndex))}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    )}
    <input
      type="text"
      placeholder="Add technology (press Enter)"
      className="form-input form-input-text"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = e.currentTarget.value.trim();
          if (val && !tags.includes(val)) onChange([...tags, val]);
          e.currentTarget.value = '';
        }
      }}
    />
  </div>
);
