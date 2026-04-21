import { useEffect, useState } from 'react';
import { formatTimestamp } from '../lib/format';
import type { HealthService, HealthStatus, LogEntry, LogsFilters } from '../types/api';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';

type ServiceDetailDrawerProps = {
  isOpen: boolean;
  serviceName: string | null;
  service: HealthService | null;
  isLoading: boolean;
  error: string | null;
  isSimulating: boolean;
  logs: LogEntry[];
  logsLoading: boolean;
  logsError: string | null;
  logsFilters: LogsFilters;
  onClose: () => void;
  onRefresh: () => void;
  onSimulate: (status: HealthStatus) => Promise<void>;
  onLogsFiltersChange: (filters: LogsFilters) => void;
  onLogsRefresh: () => void;
};

const simulationStatuses: HealthStatus[] = ['Healthy', 'Degraded', 'Unhealthy'];
const drawerTabs = ['overview', 'dependencies', 'simulation', 'logs'] as const;

type DrawerTab = (typeof drawerTabs)[number];

export function ServiceDetailDrawer({
  isOpen,
  serviceName,
  service,
  isLoading,
  error,
  isSimulating,
  logs,
  logsLoading,
  logsError,
  logsFilters,
  onClose,
  onRefresh,
  onSimulate,
  onLogsFiltersChange,
  onLogsRefresh,
}: ServiceDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('overview');

  useEffect(() => {
    setActiveTab('overview');
  }, [serviceName]);

  return (
    <aside className={`detail-drawer ${isOpen ? 'detail-drawer-open' : ''}`} aria-hidden={!isOpen}>
      <div className="drawer-header">
        <div>
          <h2>{serviceName ?? 'Select a service'}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onClose}>
          Close
        </button>
      </div>

      {!serviceName ? (
        <EmptyState
          title="No service selected"
          message="Select a service from the table to inspect dependencies, logs, and simulation controls."
        />
      ) : null}

      {serviceName && isLoading ? <div className="inline-message">Loading service details…</div> : null}
      {serviceName && error ? <div className="error-banner">{error}</div> : null}

      {serviceName && service ? (
        <div className="drawer-content">
          <section className="metadata-grid">
            <article>
              <span>Status</span>
              <StatusBadge status={service.status} />
            </article>
            <article>
              <span>Type</span>
              <strong>{service.type === 'webapp' ? 'Web app' : 'Infrastructure'}</strong>
            </article>
            <article>
              <span>Last checked</span>
              <strong>{formatTimestamp(service.lastChecked)}</strong>
            </article>
            <article>
              <span>Error count</span>
              <strong>{service.errorCount}</strong>
            </article>
          </section>

          <nav className="drawer-tabs" aria-label="Service detail tabs">
            {drawerTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`drawer-tab ${activeTab === tab ? 'drawer-tab-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'overview'
                  ? 'Overview'
                  : tab === 'dependencies'
                    ? 'Dependencies'
                    : tab === 'simulation'
                      ? 'Simulation'
                      : 'Recent logs'}
              </button>
            ))}
          </nav>

          {activeTab === 'overview' ? (
            <section className="drawer-section drawer-tab-panel">
              <div className="section-heading-row">
                <div>
                  <h3>Overview</h3>
                </div>
                <button type="button" className="ghost-button" onClick={onRefresh}>
                  Refresh detail
                </button>
              </div>
              <p className="description-copy">{service.description}</p>
            </section>
          ) : null}

          {activeTab === 'dependencies' ? (
            <section className="drawer-section drawer-tab-panel">
              <div className="section-heading-row">
                <div>
                  <h3>Dependencies</h3>
                </div>
              </div>

              {Object.keys(service.dependencies).length === 0 ? (
                <EmptyState title="No dependencies" message="This service has no upstream dependency records." />
              ) : (
                <ul className="dependency-list">
                  {Object.entries(service.dependencies).map(([dependencyName, dependency]) => (
                    <li key={dependencyName}>
                      <span>{dependencyName}</span>
                      <strong className={`dependency-inline dependency-${dependency.status.toLowerCase()}`}>
                        {dependency.status}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}

          {activeTab === 'simulation' ? (
            <section className="drawer-section drawer-tab-panel">
              <div className="section-heading-row">
                <div>
                  <h3>Simulation</h3>
                </div>
              </div>
              <div className="simulation-actions">
                {simulationStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`simulation-button simulation-${status.toLowerCase()}`}
                    disabled={isSimulating}
                    onClick={() => void onSimulate(status)}
                  >
                    {isSimulating ? 'Applying…' : `Set ${status}`}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === 'logs' ? (
            <section className="drawer-section drawer-tab-panel drawer-logs-panel">
              <div className="section-heading-row logs-heading-row">
                <div>
                  <h3>Recent logs</h3>
                </div>
                <button type="button" className="ghost-button" onClick={onLogsRefresh}>
                  Refresh logs
                </button>
              </div>

              <div className="logs-controls">
                <div>
                  <label htmlFor="logs-level">Level</label>
                  <select
                    id="logs-level"
                    value={logsFilters.level}
                    onChange={(event) =>
                      onLogsFiltersChange({
                        ...logsFilters,
                        level: event.target.value as LogsFilters['level'],
                      })
                    }
                  >
                    <option value="all">All levels</option>
                    <option value="INFO">INFO</option>
                    <option value="WARN">WARN</option>
                    <option value="ERROR">ERROR</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="logs-limit">Limit</label>
                  <input
                    id="logs-limit"
                    type="number"
                    min={1}
                    max={200}
                    value={logsFilters.limit}
                    onChange={(event) =>
                      onLogsFiltersChange({
                        ...logsFilters,
                        limit: Number(event.target.value) || 25,
                      })
                    }
                  />
                </div>
              </div>

              {logsLoading ? <div className="inline-message">Loading logs…</div> : null}
              {logsError ? <div className="error-banner">{logsError}</div> : null}

              {!logsLoading && !logsError && logs.length === 0 ? (
                <EmptyState title="No logs found" message="Try broadening the log filters or increasing the result limit." />
              ) : null}

              {logs.length > 0 ? (
                <div className="logs-table-wrapper drawer-logs-table-wrapper">
                  <table className="logs-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Level</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((entry) => (
                        <tr key={`${entry.timestamp}-${entry.level}-${entry.message}`}>
                          <td>{formatTimestamp(entry.timestamp)}</td>
                          <td>
                            <span className={`log-level log-${entry.level.toLowerCase()}`}>{entry.level}</span>
                          </td>
                          <td>{entry.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
