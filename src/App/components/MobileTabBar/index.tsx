import React from 'react';
import { Pencil, Eye } from 'lucide-react';

import { usePaneMode } from '../../hooks/usePaneMode';

/**
 * Fixed bottom tab bar for mobile / tablet-portrait. Toggles the single visible
 * pane between the editor and the resume preview. Hidden on desktop (>=1024).
 */
const MobileTabBar: React.FC = () => {
  const [pane, setPane] = usePaneMode();

  return (
    <nav className="tabbar" role="tablist" aria-label="View">
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
