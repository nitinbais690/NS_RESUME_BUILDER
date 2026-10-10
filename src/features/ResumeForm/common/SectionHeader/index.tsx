import React from 'react';

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  currentStep: number;
  totalSteps: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  description,
  currentStep,
  totalSteps,
}) => {
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
