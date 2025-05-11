import { useEffect, useRef } from 'react';

type PollingCallback = () => void | Promise<void>;

const useVisibilityPolling = (callback: PollingCallback, intervalMs: 5000) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startPolling = () => {
      callback();
      if (!intervalRef.current) {
        intervalRef.current = setInterval(callback, intervalMs);
      }
    };

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      document.visibilityState === 'visible' ? startPolling() : stopPolling();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (document.visibilityState === 'visible') {
      startPolling();
    }

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback, intervalMs]);
};

export default useVisibilityPolling;
