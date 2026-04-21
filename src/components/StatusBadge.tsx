import type { HealthStatus } from '../types/api';

type StatusBadgeProps = {
  status: HealthStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
}
