import React from 'react';
import { Pencil, Eye } from 'lucide-react';

import { usePaneMode } from '../../hooks/usePaneMode';
import { FORM_STEPS, useActiveStep } from '../../../features/ResumeForm/formSteps';

const MobileTabBar: React.FC = () => {
  const [pane, setPane] = usePaneMode();
  const currentStep = useActiveStep();
  const progressPct = ((currentStep + 1) / FORM_STEPS.length) * 100;

  return (
    <nav className="tabbar" role="tablist" aria-label="View">
      <div
        className="tabbar__progress"
        style={{ width: `${progressPct}%` }}
        aria-hidden="true"
      />
      <button
        type="button"
        role="tab"
        aria-selected={pane === 'edit'}
        className={`tabbar__tab ${pane === 'edit' ? 'is-active' : ''}`}
        onClick={() => setPane('edit')}
      >
        <Pencil size={20} />
        <span>Edit</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={pane === 'preview'}
        className={`tabbar__tab ${pane === 'preview' ? 'is-active' : ''}`}
        onClick={() => setPane('preview')}
      >
        <Eye size={20} />
        <span>Preview</span>
      </button>
    </nav>
  );
};

export default MobileTabBar;
