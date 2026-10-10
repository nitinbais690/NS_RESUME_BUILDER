import React, { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, WifiOff, X } from 'lucide-react';

/**
 * Service-worker messages: "ready to work offline" once the app is cached, and
 * "new version available" when a deploy lands. Updates never interrupt typing;
 * the user picks when to reload.
 */
const UpdateToast: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Check for a new deploy every hour for long-open tabs.
      if (registration) setInterval(() => registration.update(), 60 * 60 * 1000);
    },
  });

  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 5000);
    return () => clearTimeout(t);
  }, [offlineReady, setOfflineReady]);

  if (!offlineReady && !needRefresh) return null;

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="update-toast" role="status" aria-live="polite">
      {needRefresh ? <RefreshCw size={16} aria-hidden="true" /> : <WifiOff size={16} aria-hidden="true" />}
      <span>
        {needRefresh
          ? 'A new version of NS Studio is available.'
          : 'NS Studio is ready to work offline.'}
      </span>
      {needRefresh && (
        <button type="button" className="btn btn--primary" onClick={() => updateServiceWorker(true)}>
          Reload
        </button>
      )}
      <button type="button" className="update-toast__close" onClick={close} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
};

export default UpdateToast;
