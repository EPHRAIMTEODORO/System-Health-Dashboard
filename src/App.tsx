import { useMemo, useState } from 'react';
import './styles.css';
import { ServiceDetailDrawer } from './components/ServiceDetailDrawer';
import { ServiceTable } from './components/ServiceTable';
import { SummaryCards } from './components/SummaryCards';
import { useDashboardData } from './hooks/useDashboardData';
import { useServiceDetails } from './hooks/useServiceDetails';
import { useServiceLogs } from './hooks/useServiceLogs';
import { formatRelativeTime, formatTimestamp } from './lib/format';
import type { HealthFilters, HealthStatus, LogsFilters } from './types/api';

const initialFilters: HealthFilters = {
  status: 'all',
  type: 'all',
  search: '',
};

const initialLogsFilters: LogsFilters = {
  level: 'all',
  limit: 25,
};

function App() {
  const [filters, setFilters] = useState<HealthFilters>(initialFilters);
  const [selectedServiceName, setSelectedServiceName] = useState<string | null>(null);
  const [logsFilters, setLogsFilters] = useState<LogsFilters>(initialLogsFilters);

  const { services, isInitialLoading, isRefreshing, error, lastRefreshedAt, refresh } = useDashboardData();
  const {
    service: selectedService,
    isLoading: isDetailsLoading,
    isSimulating,
    error: detailError,
    refresh: refreshDetails,
    simulate,
  } = useServiceDetails(selectedServiceName);
  const {
    logs,
    isLoading: logsLoading,
    error: logsError,
    refresh: refreshLogs,
  } = useServiceLogs(selectedServiceName, logsFilters);

  const filteredServices = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesStatus = filters.status === 'all' || service.status === filters.status;
      const matchesType = filters.type === 'all' || service.type === filters.type;
      const matchesSearch =
        normalizedSearch.length === 0 || service.name.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [filters, services]);

  const handleSimulate = async (status: HealthStatus) => {
    await simulate(status);
    await Promise.all([refresh(), refreshDetails(), refreshLogs()]);
  };

  const selectedServiceVisible = filteredServices.some((service) => service.name === selectedServiceName);

  return (
    <div className="app-shell">
      <main className="dashboard-layout">
        <header className="dashboard-header">
          <div>
            <h1>System Health Dashboard</h1>
          </div>

          <div className="dashboard-actions">
            <button type="button" className="primary-button" onClick={() => void refresh()} disabled={isRefreshing}>
              {isRefreshing ? 'Refreshing…' : 'Refresh now'}
            </button>
            <div className="refresh-meta">
              <span>Last refreshed</span>
              <strong>{lastRefreshedAt ? formatTimestamp(lastRefreshedAt) : 'Waiting for first response'}</strong>
              <small>{formatRelativeTime(lastRefreshedAt)}</small>
            </div>
          </div>
        </header>

        {error ? <div className="error-banner">{error}</div> : null}

        <SummaryCards services={services} />

        <section className="overview-grid">
          <div className="overview-main">
            {isInitialLoading ? (
              <section className="panel loading-panel service-panel">
                <div className="inline-message">Loading system health…</div>
              </section>
            ) : (
              <ServiceTable
                services={filteredServices}
                filters={filters}
                onFiltersChange={setFilters}
                selectedServiceName={selectedServiceVisible ? selectedServiceName : null}
                onSelect={setSelectedServiceName}
              />
            )}
          </div>

          <ServiceDetailDrawer
            isOpen={Boolean(selectedServiceName)}
            serviceName={selectedServiceName}
            service={selectedService}
            isLoading={isDetailsLoading}
            error={detailError}
            isSimulating={isSimulating}
            logs={logs}
            logsLoading={logsLoading}
            logsError={logsError}
            logsFilters={logsFilters}
            onClose={() => setSelectedServiceName(null)}
            onRefresh={() => void refreshDetails()}
            onSimulate={handleSimulate}
            onLogsFiltersChange={setLogsFilters}
            onLogsRefresh={() => void refreshLogs()}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
