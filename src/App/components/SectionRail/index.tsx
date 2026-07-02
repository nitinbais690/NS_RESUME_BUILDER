import React from 'react';
import { NavLink } from 'react-router-dom';

import { FORM_STEPS } from '../../../features/ResumeForm/formSteps';

/**
 * Compact vertical icon rail for desktop section navigation. Icons are always
 * visible; the label expands on hover / active (see .rail styles). Hidden below
 * 1024px, where the bottom tab bar + form stepper take over.
 */
const SectionRail: React.FC = () => {
  return (
    <nav className="rail" aria-label="Resume sections">
      {FORM_STEPS.map((step) => {
        const Icon = step.icon;
        return (
          <NavLink
            key={step.id}
            to={'/' + step.id}
            title={step.title}
            className={({ isActive }) =>
              `rail__item ${isActive ? 'is-active' : ''}`
            }
          >
            <span className="rail__icon">
              <Icon size={18} />
            </span>
            <span className="rail__label">{step.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default SectionRail;
