import { X } from 'lucide-react';

interface TechTagProps {
  tags: string[];
  onChange: (newTags: string[]) => void;
}

export const TechTagInput = ({ tags = [], onChange }: TechTagProps) => (
  <div style={{ marginTop: '10px' }}>
    <div
      className="tech-tags-container"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '8px',
      }}
    >
      {tags.map((tech, tIndex) => (
        <span
          key={tIndex}
          className="tech-tag-edit"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '12px',
            background: '#e5e7eb',
            padding: '2px 8px',
            borderRadius: '4px',
            color: '#333',
          }}
        >
          {tech}
          <button
            onClick={() => onChange(tags.filter((_, idx) => idx !== tIndex))}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '4px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              color: '#666',
            }}
          >
            <X size={10} />
          </button>
        </span>
      ))}
    </div>
    <input
      type="text"
      placeholder="Technologies (Press Enter)"
      className="form-input"
      style={{ fontSize: '13px' }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const val = e.currentTarget.value.trim();
          if (val && !tags.includes(val)) onChange([...tags, val]);
          e.currentTarget.value = '';
        }
      }}
    />
  </div>
);
