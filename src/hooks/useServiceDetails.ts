import { useCallback, useEffect, useState } from 'react';
import { getServiceHealth, simulateServiceStatus } from '../lib/api';
import type { HealthService, HealthStatus } from '../types/api';

export function useServiceDetails(serviceName: string | null) {
  const [service, setService] = useState<HealthService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!serviceName) {
      setService(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextService = await getServiceHealth(serviceName);
      setService(nextService);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Failed to load service details';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [serviceName]);

  const simulate = useCallback(async (status: HealthStatus) => {
    if (!serviceName) {
      return null;
    }

    setIsSimulating(true);
    setError(null);

    try {
      const updatedService = await simulateServiceStatus(serviceName, status);
      setService(updatedService);
      return updatedService;
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Failed to update simulation';
      setError(message);
      throw requestError;
    } finally {
      setIsSimulating(false);
    }
  }, [serviceName]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    service,
    isLoading,
    isSimulating,
    error,
    refresh,
    simulate,
  };
}
