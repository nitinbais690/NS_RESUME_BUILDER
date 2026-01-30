import { BaseFormProps } from './types';
import { LOCAL_STORAGE_KEY } from '../../constants';
import { ResumeField } from '../../types';

import React from 'react';
import {
  User,
  FileText,
  GraduationCap,
  Wrench,
  Briefcase,
  FolderCode,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import PersonalDetails from './sections/PersonalDetails';
import AboutMe from './sections/AboutMe';
import Education from './sections/Education';
import Skill from './sections/Skill';
import Tool from './sections/Tool';
import Experience from './sections/Experience';
import Project from './sections/Project';

import Button from '../../App/common/Button';
import SectionHeader from './common/SectionHeader';
import Certification from './sections/Certification';

const FORM_STEPS = [
  {
    id: 'personal',
    title: 'Personal Details',
    icon: User,
    component: PersonalDetails,
  },
  {
    id: 'about',
    title: ResumeField.ABOUT_ME,
    icon: FileText,
    component: AboutMe,
  },
  {
    id: 'education',
    title: ResumeField.EDUCATION,
    icon: GraduationCap,
    component: Education,
  },
  {
    id: 'certification',
    title: ResumeField.CERTIFICATIONS,
    icon: GraduationCap,
    component: Certification,
  },
  { id: 'skills', title: ResumeField.SKILLS, icon: Sparkles, component: Skill },
  { id: 'tools', title: ResumeField.TOOLS, icon: Wrench, component: Tool },
  {
    id: 'experience',
    title: ResumeField.EXPERIENCE,
    icon: Briefcase,
    component: Experience,
  },
  {
    id: 'projects',
    title: ResumeField.PROJECTS,
    icon: FolderCode,
    component: Project,
  },
];

const ResumeForm: React.FC<BaseFormProps> = ({ resumeData, setResumeData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activePath = location.pathname.substring(
    location.pathname.lastIndexOf('/') + 1,
  );
  const currentStepIndex = FORM_STEPS.findIndex(
    (step) => step.id === activePath,
  );
  const currentStep = currentStepIndex !== -1 ? currentStepIndex : 0;

  // Helper variables for current state
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === FORM_STEPS.length - 1;
  const ActiveIcon = FORM_STEPS[currentStep].icon;

  // Handlers
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
    <div className="form-resume-form-layout">
      {/* --- Sidebar Navigation --- */}
      <aside className="form-nav-sidebar">
        <div className="form-nav-header">
          <h3>Resume Builder</h3>
        </div>

        <nav className="form-nav-items">
          {FORM_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;

            return (
              <NavLink
                key={step.id}
                to={'/' + step.id}
                className={({ isActive }) =>
                  `form-nav-item ${isActive ? 'active' : ''} ${
                    isCompleted ? 'completed' : ''
                  }`
                }
              >
                <div className="form-nav-icon-wrapper">
                  <Icon size={18} />
                </div>
                <span>{step.title}</span>
                <div className="form-active-indicator" />
              </NavLink>
            );
          })}
          <Button onClick={handleReset} className="btn-clear-storage">
            <RotateCcw size={14} /> Clear Progress
          </Button>
        </nav>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="form-content-area">
        <SectionHeader
          icon={ActiveIcon}
          title={FORM_STEPS[currentStep].title}
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
              <Route
                key={id}
                path={id}
                element={
                  <Component
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                  />
                }
              />
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
      </main>
    </div>
  );
};

export default ResumeForm;
