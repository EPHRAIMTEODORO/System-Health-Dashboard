import type { HealthService, HealthStatus, LogEntry, LogLevel } from '../types/api';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3000';
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(message || `Request failed with status ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}

export function getDashboardHealth(): Promise<HealthService[]> {
  return request<HealthService[]>('/health');
}

export function getServiceHealth(serviceName: string): Promise<HealthService> {
  return request<HealthService>(`/health/${encodeURIComponent(serviceName)}`);
}

export function getServiceLogs(
  serviceName: string,
  filters: { level?: LogLevel; limit?: number },
): Promise<LogEntry[]> {
  const searchParams = new URLSearchParams();

  if (filters.level) {
    searchParams.set('level', filters.level);
  }

  if (filters.limit) {
    searchParams.set('limit', String(filters.limit));
  }

  const query = searchParams.toString();
  return request<LogEntry[]>(`/logs/${encodeURIComponent(serviceName)}${query ? `?${query}` : ''}`);
}

export function simulateServiceStatus(
  serviceName: string,
  status: HealthStatus,
): Promise<HealthService> {
  return request<HealthService>(`/simulate/${encodeURIComponent(serviceName)}`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export { API_BASE_URL, ApiError };
