import { formatCount } from '../lib/format';
import type { HealthService } from '../types/api';

type DependencySummaryProps = {
  service: HealthService;
};

export function DependencySummary({ service }: DependencySummaryProps) {
  const entries = Object.entries(service.dependencies);

  if (entries.length === 0) {
    return <span className="dependency-empty">No dependencies</span>;
  }

  const impactedCount = entries.filter(([, dependency]) => dependency.status !== 'Healthy').length;

  return (
    <div className="dependency-summary">
      <div className="dependency-tags">
        {entries.map(([name, dependency]) => (
          <span
            key={name}
            className={`dependency-pill dependency-${dependency.status.toLowerCase().replace(/[^a-z]/g, '-')}`}
            title={`${name}: ${dependency.status}`}
          >
            <span>{name}</span>
            <strong>{dependency.status}</strong>
          </span>
        ))}
      </div>
      <p>{impactedCount === 0 ? 'All dependencies healthy' : formatCount(impactedCount, 'dependency impacted')}</p>
    </div>
  );
}
