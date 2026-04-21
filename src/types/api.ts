export type ServiceType = 'infrastructure' | 'webapp';
export type HealthStatus = 'Healthy' | 'Degraded' | 'Unhealthy';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export type ServiceDependency = {
  status: string;
};

export type HealthService = {
  name: string;
  type: ServiceType;
  status: HealthStatus;
  lastChecked: string;
  errorCount: number;
  description: string;
  dependencies: Record<string, ServiceDependency>;
};

export type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
};

export type HealthFilters = {
  status: HealthStatus | 'all';
  type: ServiceType | 'all';
  search: string;
};

export type LogsFilters = {
  level: LogLevel | 'all';
  limit: number;
};
