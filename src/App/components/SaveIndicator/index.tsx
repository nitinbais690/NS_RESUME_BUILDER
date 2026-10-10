import React from 'react';
import { AlertTriangle, CheckCircle2, CloudOff } from 'lucide-react';

import { useSaveStatus } from '../../../store/saveStatus';
import { useOnline } from '../../hooks/useOnline';

const time = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

/**
 * Tells people their work is safe: "Saved" after every change, "Offline" when
 * there's no connection (editing still works and still saves locally), and a
 * clear warning if the browser refuses to store data.
 */
const SaveIndicator: React.FC = () => {
  const { state, savedAt, error } = useSaveStatus();
  const online = useOnline();

  if (state === 'error') {
    return (
      <span
        className="save-indicator save-indicator--error"
        role="alert"
        title={`${error} Changes aren't being saved. Use Export as JSON in the resume menu to keep a copy.`}
      >
        <AlertTriangle size={14} aria-hidden="true" />
        <span className="save-indicator__text">Not saved</span>
      </span>
    );
  }

  const label = online ? 'Saved' : 'Offline · saved';
  return (
    <span
      className={`save-indicator ${online ? '' : 'save-indicator--offline'}`}
      role="status"
      aria-live="polite"
      title={`Saved on this device at ${time(savedAt)}${online ? '' : '. You are offline; everything keeps working.'}`}
    >
      {/* key restarts the pulse animation on every save */}
      <span key={savedAt} className="save-indicator__icon">
        {online ? <CheckCircle2 size={14} aria-hidden="true" /> : <CloudOff size={14} aria-hidden="true" />}
      </span>
      <span className="save-indicator__text">{label}</span>
    </span>
  );
};

export default SaveIndicator;
