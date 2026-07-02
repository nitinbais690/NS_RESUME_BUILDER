import { LOCAL_STORAGE_KEY } from '../../constants';

import React from 'react';
import { ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import SectionHeader from './common/SectionHeader';
import { FORM_STEPS, useActiveStep } from './formSteps';

const ResumeForm: React.FC = () => {
  const navigate = useNavigate();
  const currentStep = useActiveStep();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === FORM_STEPS.length - 1;
  const ActiveIcon = FORM_STEPS[currentStep].icon;

  const handleNext = () => {
    if (!isLastStep) {
      navigate('/' + FORM_STEPS[currentStep + 1].id);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      navigate('/' + FORM_STEPS[currentStep - 1].id);
    }
  };

  const handleReset = () => {
    if (window.confirm('Clear all progress?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <div className="form-content-area">
      <SectionHeader
        icon={ActiveIcon}
        title={FORM_STEPS[currentStep].title}
        description={FORM_STEPS[currentStep].description}
        currentStep={currentStep + 1}
        totalSteps={FORM_STEPS.length}
      />

      {/* Injected Active Section */}
      <div className="form-component-wrapper">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={'/' + FORM_STEPS[0].id} replace />}
          />
          {FORM_STEPS.map(({ id, component: Component }) => (
            <Route key={id} path={id} element={<Component />} />
          ))}
        </Routes>
      </div>

      {/* Footer Navigation */}
      <footer className="form-navigation-buttons">
        <button
          onClick={handlePrev}
          disabled={isFirstStep}
          className="form-btn-nav form-btn-prev"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <button
          onClick={handleNext}
          className={`form-btn-nav ${
            isLastStep ? 'form-btn-finish' : 'form-btn-next'
          }`}
        >
          {isLastStep ? 'Finish' : 'Next'} <ChevronRight size={16} />
        </button>
      </footer>

      <button
        type="button"
        onClick={handleReset}
        className="btn-clear-storage"
      >
        <RotateCcw size={14} /> Clear Progress
      </button>
    </div>
  );
};

export default ResumeForm;
