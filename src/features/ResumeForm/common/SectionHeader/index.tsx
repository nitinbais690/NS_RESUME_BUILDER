import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { ResumeField } from '../../../../types';
import { useResumeStore } from '../../../../store/useResumeStore';

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  currentStep: number;
  totalSteps: number;
  /** When set, shows a toggle to hide this section on the resume. */
  field?: ResumeField;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  description,
  currentStep,
  totalSteps,
  field,
}) => {
  const hidden = useResumeStore((s) => !!field && s.hiddenSections.includes(field));
  const toggleSection = useResumeStore((s) => s.toggleSection);

  return (
    <div className="form-section-header">
      <div className="form-section-icon-wrapper">
        <Icon size={22} />
      </div>

      <div className="form-section-info">
        <h2 className="form-section-heading">{title}</h2>
        {description && (
          <p className="form-section-description">{description}</p>
        )}
      </div>

      {field && (
        <button
          type="button"
          className={`section-visibility ${hidden ? 'is-hidden' : ''}`}
          aria-pressed={!hidden}
          onClick={() => toggleSection(field)}
          title={hidden ? 'Hidden from the resume. Click to show.' : 'Shown on the resume. Click to hide.'}
        >
          {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>{hidden ? 'Hidden' : 'Shown'}</span>
        </button>
      )}

      <div
        className="form-step-dots"
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <span
            key={i}
            className={[
              'form-step-dot',
              i < currentStep - 1 ? 'is-done' : '',
              i === currentStep - 1 ? 'is-current' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionHeader;
