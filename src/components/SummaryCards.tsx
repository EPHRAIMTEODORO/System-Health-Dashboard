import type { HealthService, HealthStatus } from '../types/api';

type SummaryCardsProps = {
  services: HealthService[];
};

type SummaryItem = {
  label: string;
  value: number;
  tone: 'neutral' | Lowercase<HealthStatus>;
};

export function SummaryCards({ services }: SummaryCardsProps) {
  const healthyCount = services.filter((service) => service.status === 'Healthy').length;
  const degradedCount = services.filter((service) => service.status === 'Degraded').length;
  const unhealthyCount = services.filter((service) => service.status === 'Unhealthy').length;
  const totalServices = services.length;

  const items: SummaryItem[] = [
    { label: 'Total services', value: totalServices, tone: 'neutral' },
    { label: 'Healthy', value: healthyCount, tone: 'healthy' },
    { label: 'Degraded', value: degradedCount, tone: 'degraded' },
    { label: 'Unhealthy', value: unhealthyCount, tone: 'unhealthy' },
  ];

  const totalForBar = totalServices || 1;

  return (
    <section className="summary-panel">
      <div className="summary-grid">
        {items.map((item) => (
          <article key={item.label} className={`summary-card tone-${item.tone}`}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
      <div className="summary-bar" aria-hidden="true">
        <span className="summary-segment status-healthy" style={{ width: `${(healthyCount / totalForBar) * 100}%` }} />
        <span className="summary-segment status-degraded" style={{ width: `${(degradedCount / totalForBar) * 100}%` }} />
        <span className="summary-segment status-unhealthy" style={{ width: `${(unhealthyCount / totalForBar) * 100}%` }} />
      </div>
    </section>
  );
}
