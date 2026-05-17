import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export interface Incident {
  id: number;
  organization_id: number;
  business_id: number;
  url: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  last_status_code: number;
  last_error: string | null;
}

export interface CheckState {
  business_id: number;
  consecutive_failures: number;
  open_incident_id: number | null;
  last_ok_at: string | null;
  /** Evita repetir alertas SSL en el mismo tramo (warning / expired). */
  ssl_alert_level?: 'warning' | 'expired' | null;
}

interface Store {
  incidents: Incident[];
  check_states: Record<string, CheckState>;
  next_incident_id: number;
}

const __dir = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dir, '..', 'data', 'store.json');

function defaultStore(): Store {
  return { incidents: [], check_states: {}, next_incident_id: 1 };
}

function load(): Store {
  if (!existsSync(DATA_FILE)) {
    return defaultStore();
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf8')) as Store;
}

function save(store: Store): void {
  mkdirSync(dirname(DATA_FILE), { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function getCheckState(businessId: number): CheckState {
  const store = load();
  const key = String(businessId);
  if (!store.check_states[key]) {
    store.check_states[key] = {
      business_id: businessId,
      consecutive_failures: 0,
      open_incident_id: null,
      last_ok_at: null,
    };
    save(store);
  }
  return store.check_states[key];
}

export function setCheckState(state: CheckState): void {
  const store = load();
  store.check_states[String(state.business_id)] = state;
  save(store);
}

export function createIncident(
  data: Omit<Incident, 'id' | 'ended_at' | 'duration_seconds'>,
): Incident {
  const store = load();
  const inc: Incident = {
    ...data,
    id: store.next_incident_id++,
    ended_at: null,
    duration_seconds: null,
  };
  store.incidents.push(inc);
  save(store);
  return inc;
}

export function closeIncident(id: number, endedAt: Date, statusCode: number): Incident | null {
  const store = load();
  const inc = store.incidents.find((i) => i.id === id);
  if (!inc) return null;
  inc.ended_at = endedAt.toISOString();
  inc.duration_seconds = Math.floor(
    (endedAt.getTime() - new Date(inc.started_at).getTime()) / 1000,
  );
  inc.last_status_code = statusCode;
  save(store);
  return inc;
}

export function listIncidents(businessId: number, limit = 20): Incident[] {
  const store = load();
  return store.incidents
    .filter((i) => i.business_id === businessId)
    .sort((a, b) => b.started_at.localeCompare(a.started_at))
    .slice(0, limit);
}

export function uptime30dPct(businessId: number): number {
  const store = load();
  const since = Date.now() - 30 * 24 * 3600_000;
  const relevant = store.incidents.filter(
    (i) => i.business_id === businessId && new Date(i.started_at).getTime() >= since,
  );
  if (relevant.length === 0) return 100;
  const downMs = relevant.reduce((acc, inc) => {
    const start = new Date(inc.started_at).getTime();
    const end = inc.ended_at ? new Date(inc.ended_at).getTime() : Date.now();
    return acc + Math.max(0, end - start);
  }, 0);
  const total = 30 * 24 * 3600_000;
  return Math.round(Math.max(0, 100 - (downMs / total) * 100) * 10) / 10;
}
