import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import {
  FORM_STEPS,
  useActiveStep,
} from '../../../features/ResumeForm/formSteps';

/**
 * Section navigation. Desktop: compact vertical icon rail with hover labels.
 * Below 1024px: a horizontal, swipeable chip strip above the form (see .rail
 * styles), with the active chip kept scrolled into view.
 */
const SectionRail: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const activeStep = useActiveStep();

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('.rail__item.is-active');
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
    // Scroll the strip itself (not scrollIntoView) so the page never jumps.
    nav.scrollTo({
      left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2,
      behavior: 'smooth',
    });
  }, [activeStep]);

  return (
    <nav className="rail" aria-label="Resume sections" ref={navRef}>
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
