import { useCallback, useEffect, useState } from 'react';
import { getServiceLogs } from '../lib/api';
import type { LogEntry, LogLevel } from '../types/api';

export function useServiceLogs(
  serviceName: string | null,
  filters: { level: LogLevel | 'all'; limit: number },
) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!serviceName) {
      setLogs([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextLogs = await getServiceLogs(serviceName, {
        level: filters.level === 'all' ? undefined : filters.level,
        limit: filters.limit,
      });
      setLogs(nextLogs);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Failed to load service logs';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters.level, filters.limit, serviceName]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    logs,
    isLoading,
    error,
    refresh,
  };
}
