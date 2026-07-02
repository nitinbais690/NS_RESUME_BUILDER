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

      <span className="form-section-step">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
};

export default SectionHeader;
