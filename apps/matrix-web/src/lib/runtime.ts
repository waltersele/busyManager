export interface WebUptimeIncident {
  id: number;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  last_status_code: number;
}

export interface WebUptimeRuntime {
  url: string;
  last_check_at: string | null;
  is_up: boolean;
  last_status_code: number;
  uptime_30d_pct: number;
  open_incident: WebUptimeIncident | null;
  recent_incidents: WebUptimeIncident[];
  ssl_ok?: boolean;
  ssl_expires_at?: string | null;
  ssl_days_remaining?: number | null;
}

export type AppRuntimePayload = WebUptimeRuntime | Record<string, unknown>;
