import React from 'react';

import { LOCAL_STORAGE_KEY } from '../../../constants';

interface State {
  error: Error | null;
}

const readSaved = (): string | null => {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  } catch {
    return null;
  }
};

/**
 * Last line of defense: if rendering crashes (e.g. corrupted saved data),
 * show a recovery screen instead of a blank page. The user can download their
 * raw saved data first, so nothing is lost even if they then reset.
 */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('NS Studio crashed:', error, info.componentStack);
  }

  private downloadBackup = () => {
    const raw = readSaved();
    if (!raw) return;
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `ns-studio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  private reset = () => {
    if (!window.confirm('Delete all saved resumes on this device and start fresh?')) return;
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      /* storage unavailable: reload will still start clean */
    }
    window.location.assign('/');
  };

  render() {
    if (!this.state.error) return this.props.children;
    const hasSaved = !!readSaved();

    return (
      <main className="crash" role="alert">
        <h1>Something went wrong</h1>
        <p>
          NS Studio hit an unexpected error. Your resumes are still saved in this
          browser. Try reloading first.
        </p>
        <div className="crash__actions">
          <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
            Reload
          </button>
          {hasSaved && (
            <button type="button" className="btn" onClick={this.downloadBackup}>
              Download my saved data
            </button>
          )}
          <button type="button" className="btn crash__reset" onClick={this.reset}>
            Reset and start fresh
          </button>
        </div>
        <details className="crash__details">
          <summary>Technical details</summary>
          <pre>{this.state.error.message}</pre>
        </details>
      </main>
    );
  }
}

export default ErrorBoundary;
