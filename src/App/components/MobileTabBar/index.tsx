import React from 'react';
import ReactDOM from 'react-dom';
import { Pencil, Eye } from 'lucide-react';

import { usePaneMode } from '../../hooks/usePaneMode';
import { FORM_STEPS, useActiveStep } from '../../../features/ResumeForm/formSteps';

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MobileTabBar: React.FC = () => {
  const [pane, setPane] = usePaneMode();
  const currentStep = useActiveStep();
  const isEdit = pane === 'edit';

  const progress = (currentStep + 1) / FORM_STEPS.length;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const fab = (
    <div className="pane-fab">
      <div className="pane-fab__circle">
        <svg className="pane-fab__ring" viewBox="0 0 60 60" aria-hidden="true">
          <circle cx="30" cy="30" r={RADIUS} className="pane-fab__ring-track" />
          <circle
            cx="30" cy="30" r={RADIUS}
            className="pane-fab__ring-fill"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <button
          type="button"
          className="pane-fab__btn"
          onClick={() => setPane(isEdit ? 'preview' : 'edit')}
          aria-label={isEdit ? 'Switch to Preview' : 'Switch to Edit'}
        >
          {isEdit ? <Eye size={20} /> : <Pencil size={20} />}
        </button>
      </div>
      <span className="pane-fab__label" aria-hidden="true">
        {isEdit ? `${currentStep + 1}/${FORM_STEPS.length} · Preview` : 'Edit'}
      </span>
    </div>
  );

  return ReactDOM.createPortal(fab, document.body);
};

export default MobileTabBar;
