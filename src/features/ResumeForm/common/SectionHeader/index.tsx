import React from 'react';

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  currentStep: number;
  totalSteps: number;
  iconColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  currentStep,
  totalSteps,
  iconColor = '#7A1B1B',
}) => {
  return (
    <div
      className="form-section-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* LEFT: Icon */}
      <div className="form-section-icon-wrapper" style={{ margin: 0 }}>
        <Icon size={24} color={iconColor} />
      </div>

      {/* CENTER: Title */}
      <div
        className="form-section-info"
        style={{ textAlign: 'center', flex: 1 }}
      >
        <h2 className="form-section-heading" style={{ margin: 0 }}>
          {title}
        </h2>
      </div>

      {/* RIGHT: Active Step */}
      <div
        className="form-section-step"
        style={{ minWidth: '100px', textAlign: 'right' }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: '#666',
            fontWeight: 500,
          }}
        >
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
};

export default SectionHeader;
