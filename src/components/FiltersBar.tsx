import type { HealthFilters } from '../types/api';

type FiltersBarProps = {
  filters: HealthFilters;
  onChange: (filters: HealthFilters) => void;
};

export function FiltersBar({ filters, onChange }: FiltersBarProps) {
  return (
    <section className="control-panel filters-panel">
      <div>
        <label htmlFor="service-search">Search service</label>
        <input
          id="service-search"
          type="search"
          placeholder="Email, WebApp1..."
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </div>

      <div>
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as HealthFilters['status'],
            })
          }
        >
          <option value="all">All statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="Degraded">Degraded</option>
          <option value="Unhealthy">Unhealthy</option>
        </select>
      </div>

      <div>
        <label htmlFor="type-filter">Type</label>
        <select
          id="type-filter"
          value={filters.type}
          onChange={(event) =>
            onChange({
              ...filters,
              type: event.target.value as HealthFilters['type'],
            })
          }
        >
          <option value="all">All types</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="webapp">Web app</option>
        </select>
      </div>
    </section>
  );
}
