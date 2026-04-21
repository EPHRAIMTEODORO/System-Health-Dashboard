import { formatTimestamp } from '../lib/format';
import type { HealthFilters, HealthService } from '../types/api';
import { DependencySummary } from './DependencySummary';
import { EmptyState } from './EmptyState';
import { FiltersBar } from './FiltersBar';
import { StatusBadge } from './StatusBadge';

type ServiceTableProps = {
  services: HealthService[];
  filters: HealthFilters;
  onFiltersChange: (filters: HealthFilters) => void;
  selectedServiceName: string | null;
  onSelect: (serviceName: string) => void;
};

export function ServiceTable({
  services,
  filters,
  onFiltersChange,
  selectedServiceName,
  onSelect,
}: ServiceTableProps) {
  if (services.length === 0) {
    return (
      <section className="panel service-panel">
        <FiltersBar filters={filters} onChange={onFiltersChange} />
        <EmptyState
          title="No services match the current filters"
          message="Try clearing the search or widening the status and type filters."
        />
      </section>
    );
  }

  return (
    <section className="panel service-panel">
      <FiltersBar filters={filters} onChange={onFiltersChange} />

      <div className="panel-header">
        <div>
          <h2>Service health</h2>
          <p>Operational overview across infrastructure and web applications.</p>
        </div>
      </div>

      <div className="service-table-wrapper">
        <table className="service-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Last checked</th>
              <th>Error count</th>
              <th>Dependency summary</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.name}
                className={selectedServiceName === service.name ? 'selected-row' : undefined}
                onClick={() => onSelect(service.name)}
              >
                <td>
                  <button className="service-name-button" type="button" onClick={() => onSelect(service.name)}>
                    {service.name}
                  </button>
                </td>
                <td>
                  <span className="type-chip">{service.type === 'webapp' ? 'Web app' : 'Infrastructure'}</span>
                </td>
                <td>
                  <StatusBadge status={service.status} />
                </td>
                <td>{formatTimestamp(service.lastChecked)}</td>
                <td>{service.errorCount}</td>
                <td>
                  <DependencySummary service={service} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
