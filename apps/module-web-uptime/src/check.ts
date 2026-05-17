import { createMatrixClient } from '@busymanager/matrix-sdk';
import {
  closeIncident,
  createIncident,
  getCheckState,
  listIncidents,
  setCheckState,
  uptime30dPct,
} from './db.js';
import { checkSsl } from './ssl.js';

const baseUrl = process.env.MATRIX_API_URL ?? 'http://localhost:8080';
const moduleKey = process.env.MODULE_API_KEY ?? '';
const CONFIRM_FAILURES = 2;

if (!moduleKey) {
  console.error('MODULE_API_KEY is required');
  process.exit(1);
}

const matrix = createMatrixClient({ baseUrl, moduleKey });

async function ping(url: string): Promise<{ ok: boolean; status: number; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: e instanceof Error ? e.message : 'fetch failed' };
  }
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec} segundos`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m} minutos`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

async function publishRuntime(
  businessId: number,
  orgId: number,
  url: string,
  isUp: boolean,
  statusCode: number,
  openIncidentId: number | null,
  ssl: {
    ssl_ok: boolean;
    ssl_expires_at: string | null;
    ssl_days_remaining: number | null;
  },
) {
  const recent = listIncidents(businessId, 10);
  const open = openIncidentId
    ? recent.find((i) => i.id === openIncidentId) ?? null
    : null;

  await matrix.runtime.publish({
    url,
    last_check_at: new Date().toISOString(),
    is_up: isUp,
    last_status_code: statusCode,
    uptime_30d_pct: uptime30dPct(businessId),
    open_incident: open
      ? {
          id: open.id,
          started_at: open.started_at,
          ended_at: open.ended_at,
          duration_seconds: open.duration_seconds,
          last_status_code: open.last_status_code,
        }
      : null,
    recent_incidents: recent.map((i) => ({
      id: i.id,
      started_at: i.started_at,
      ended_at: i.ended_at,
      duration_seconds: i.duration_seconds,
      last_status_code: i.last_status_code,
    })),
    ssl_ok: ssl.ssl_ok,
    ssl_expires_at: ssl.ssl_expires_at,
    ssl_days_remaining: ssl.ssl_days_remaining,
    organization_id: orgId,
    business_id: businessId,
  });
}

async function maybeAlertSsl(
  monitorUrl: string,
  ssl: { ssl_ok: boolean; ssl_days_remaining: number | null },
  state: ReturnType<typeof getCheckState>,
) {
  const days = ssl.ssl_days_remaining;
  if (days == null) return;

  if (days <= 0 && state.ssl_alert_level !== 'expired') {
    state.ssl_alert_level = 'expired';
    setCheckState(state);
    await matrix.notify('alert_center', {
      title: 'Certificado SSL caducado',
      body: `El certificado de ${monitorUrl} ha caducado. Renueva el SSL para evitar avisos en el navegador.`,
      severity: 'critical',
    });
    return;
  }

  if (days > 0 && days < 30 && state.ssl_alert_level !== 'warning' && state.ssl_alert_level !== 'expired') {
    state.ssl_alert_level = 'warning';
    setCheckState(state);
    await matrix.notify('alert_center', {
      title: 'Certificado SSL por caducar',
      body: `El certificado de ${monitorUrl} caduca en ${days} días. Planifica la renovación con tu hosting.`,
      severity: 'warning',
    });
    return;
  }

  if (days >= 30 && state.ssl_alert_level) {
    state.ssl_alert_level = null;
    setCheckState(state);
  }
}

async function main() {
  await matrix.subscriptions.check('web-uptime');
  await matrix.tokens.check(0);

  const ctx = await matrix.auth.check();
  const businessId = ctx.business_id;
  const orgId = ctx.organization_id;

  const settings = (ctx as { settings?: { web?: { url?: string }; monitor_url?: string } })
    .settings ?? {};
  const url = settings.web?.url || (settings as { monitor_url?: string }).monitor_url;

  if (!url) {
    console.error('No web.url in business settings');
    process.exit(1);
  }

  const monitorUrl: string = url;

  console.log(`Checking ${monitorUrl}…`);
  const [result, ssl] = await Promise.all([ping(monitorUrl), checkSsl(monitorUrl)]);
  const state = getCheckState(businessId);
  const now = new Date();

  await maybeAlertSsl(monitorUrl, ssl, state);

  if (result.ok) {
    state.consecutive_failures = 0;
    state.last_ok_at = now.toISOString();

    if (state.open_incident_id) {
      const closed = closeIncident(state.open_incident_id, now, result.status);
      state.open_incident_id = null;
      setCheckState(state);

      const duration = closed?.duration_seconds ?? 0;
      await matrix.notify('alert_center', {
        title: 'Web recuperada',
        body: `La URL ${monitorUrl} vuelve a responder (HTTP ${result.status}). Indisponibilidad: ${formatDuration(duration)}.`,
        severity: 'info',
      });
      await matrix.webhooks.emit('site.up', {
        url: monitorUrl,
        statusCode: result.status,
        durationSeconds: duration,
        incidentId: closed?.id,
      });
      console.log(`Recovered after ${duration}s`);
    } else {
      setCheckState(state);
      console.log(`OK: ${monitorUrl} (${result.status})`);
    }

    await publishRuntime(businessId, orgId, monitorUrl, true, result.status, null, ssl);
    return;
  }

  state.consecutive_failures += 1;
  console.warn(`Fail ${state.consecutive_failures}/${CONFIRM_FAILURES}: ${monitorUrl} (${result.status})`);

  if (state.consecutive_failures >= CONFIRM_FAILURES && !state.open_incident_id) {
    const inc = createIncident({
      organization_id: orgId,
      business_id: businessId,
      url: monitorUrl,
      started_at: now.toISOString(),
      last_status_code: result.status,
      last_error: result.error ?? null,
    });
    state.open_incident_id = inc.id;
    setCheckState(state);

    await matrix.notify('alert_center', {
      title: 'Web caída detectada',
      body: `La URL ${monitorUrl} no responde correctamente (HTTP ${result.status}).`,
      severity: 'critical',
    });
    await matrix.webhooks.emit('site.down', {
      url: monitorUrl,
      statusCode: result.status,
      incidentId: inc.id,
    });
    console.warn(`Incident #${inc.id} opened`);
  } else {
    setCheckState(state);
  }

  await publishRuntime(
    businessId,
    orgId,
    monitorUrl,
    false,
    result.status,
    state.open_incident_id,
    ssl,
  );

  if (!result.ok && state.open_incident_id) {
    process.exit(2);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
