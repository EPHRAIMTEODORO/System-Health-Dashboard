import { useCallback, useEffect, useRef, useState } from 'react';
import { getDashboardHealth } from '../lib/api';
import type { HealthService } from '../types/api';

const POLL_INTERVAL_MS = 5000;

export function useDashboardData() {
  const [services, setServices] = useState<HealthService[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);
  const activeRequestRef = useRef(0);

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;

    if (options?.silent) {
      setIsRefreshing(true);
    } else {
      setError(null);
      setIsInitialLoading((current) => current && services.length === 0);
      setIsRefreshing(services.length > 0);
    }

    try {
      const nextServices = await getDashboardHealth();

      if (activeRequestRef.current !== requestId) {
        return;
      }

      setServices(nextServices);
      setError(null);
      setLastRefreshedAt(new Date().toISOString());
    } catch (requestError) {
      if (activeRequestRef.current !== requestId) {
        return;
      }

      const message = requestError instanceof Error ? requestError.message : 'Failed to load service health';
      setError(message);
    } finally {
      if (activeRequestRef.current === requestId) {
        setIsInitialLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [services.length]);

  useEffect(() => {
    void refresh();

    const intervalId = window.setInterval(() => {
      void refresh({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refresh]);

  return {
    services,
    isInitialLoading,
    isRefreshing,
    error,
    lastRefreshedAt,
    refresh,
  };
}
