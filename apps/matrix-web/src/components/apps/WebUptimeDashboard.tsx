'use client';

import PageHeader from '@/components/PageHeader';
import { api, getBusinessId } from '@/lib/api';
import { WebUptimeRuntime } from '@/lib/runtime';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function WebUptimeDashboard({
  appName,
  onDeactivate,
}: {
  appName: string;
  onDeactivate: () => void;
}) {
  const businessId = getBusinessId();
  const [runtime, setRuntime] = useState<WebUptimeRuntime | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!businessId) return;
    api<{ payload: WebUptimeRuntime | null }>(
      `/businesses/${businessId}/apps/web-uptime/runtime`,
    )
      .then((r) => setRuntime(r.payload))
      .catch(() => setRuntime(null))
      .finally(() => setLoading(false));
  }, [businessId]);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando monitor…</p>;
  }

  const isUp = runtime?.is_up ?? true;
  const hasData = runtime?.last_check_at != null;

  return (
    <div>
      <PageHeader
        title={appName}
        description="Disponibilidad de tu web y estado del certificado SSL"
        action={
          <button type="button" className="btn-ghost" onClick={onDeactivate}>
            Desactivar app
          </button>
        }
      />

      {!hasData && (
        <div className="alert mb-6">
          Aún no hay comprobaciones. Configura la URL en{' '}
          <Link href="/dashboard/settings/business" className="font-medium underline">
            Configuración → Web
          </Link>{' '}
          y ejecuta el worker del módulo (<code className="text-xs">pnpm check</code> en{' '}
          <code className="text-xs">module-web-uptime</code>).
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Estado actual"
          value={hasData ? (isUp ? 'En línea' : 'Caída') : '—'}
          variant={hasData ? (isUp ? 'ok' : 'error') : 'neutral'}
        />
        <KpiCard
          label="Última comprobación"
          value={
            runtime?.last_check_at
              ? new Date(runtime.last_check_at).toLocaleString('es-ES')
              : '—'
          }
        />
        <KpiCard
          label="Uptime 30 días"
          value={hasData ? `${runtime?.uptime_30d_pct ?? 100}%` : '—'}
        />
        <KpiCard
          label="Certificado SSL"
          value={sslKpiLabel(runtime)}
          variant={sslKpiVariant(runtime)}
        />
      </div>

      {runtime?.open_incident && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Incidencia abierta desde{' '}
          {new Date(runtime.open_incident.started_at).toLocaleString('es-ES')}.
        </div>
      )}

      {runtime?.url && (
        <p className="mt-4 text-sm text-slate-500">
          URL monitorizada:{' '}
          <a href={runtime.url} className="text-orange-600 hover:underline" target="_blank" rel="noreferrer">
            {runtime.url}
          </a>
        </p>
      )}

      <div className="mt-8 card">
        <h3 className="text-sm font-semibold text-slate-900">Disponibilidad reciente</h3>
        <UptimeBars incidents={runtime?.recent_incidents ?? []} isUp={isUp} />
      </div>

      <div className="mt-6 card">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Historial de incidencias</h3>
        {(runtime?.recent_incidents?.length ?? 0) === 0 ? (
          <p className="text-sm text-slate-500">Sin incidencias registradas.</p>
        ) : (
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Duración</th>
                <th>HTTP</th>
              </tr>
            </thead>
            <tbody>
              {runtime!.recent_incidents.map((inc) => (
                <tr key={inc.id}>
                  <td>{new Date(inc.started_at).toLocaleString('es-ES')}</td>
                  <td>
                    {inc.ended_at
                      ? new Date(inc.ended_at).toLocaleString('es-ES')
                      : 'En curso'}
                  </td>
                  <td>
                    {inc.duration_seconds != null
                      ? formatDuration(inc.duration_seconds)
                      : '—'}
                  </td>
                  <td>{inc.last_status_code || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  variant = 'neutral',
}: {
  label: string;
  value: string;
  variant?: 'ok' | 'error' | 'neutral';
}) {
  const colors = {
    ok: 'text-emerald-600',
    error: 'text-red-600',
    neutral: 'text-slate-900',
  };
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-xl font-semibold ${colors[variant]}`}>{value}</p>
    </div>
  );
}

function UptimeBars({
  incidents,
  isUp,
}: {
  incidents: { started_at: string; ended_at: string | null }[];
  isUp: boolean;
}) {
  const bars = 24;
  const now = Date.now();
  const cells = Array.from({ length: bars }, (_, i) => {
    const t = now - (bars - 1 - i) * 3600_000;
    const down = incidents.some((inc) => {
      const start = new Date(inc.started_at).getTime();
      const end = inc.ended_at ? new Date(inc.ended_at).getTime() : now;
      return t >= start && t <= end;
    });
    return down;
  });
  if (!incidents.length && isUp) {
    return (
      <div className="mt-4 flex h-12 items-end gap-0.5">
        {cells.map((down, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t ${down ? 'bg-red-400' : 'bg-emerald-400'}`}
            style={{ height: down ? '40%' : '100%' }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-4 flex h-12 items-end gap-0.5">
      {cells.map((down, i) => (
        <div
          key={i}
          title={down ? 'Incidencia' : 'OK'}
          className={`flex-1 rounded-t ${down ? 'bg-red-400' : 'bg-emerald-400'}`}
          style={{ height: down ? '35%' : '90%' }}
        />
      ))}
    </div>
  );
}

function sslKpiLabel(runtime: WebUptimeRuntime | null): string {
  if (runtime?.ssl_days_remaining == null) {
    if (runtime?.ssl_ok === false) return 'No disponible';
    return '—';
  }
  const days = runtime.ssl_days_remaining;
  if (days <= 0) return 'Caducado';
  if (days < 30) return `Caduca en ${days} días`;
  return `Válido (${days} días)`;
}

function sslKpiVariant(runtime: WebUptimeRuntime | null): 'ok' | 'error' | 'neutral' {
  if (runtime?.ssl_days_remaining == null) return 'neutral';
  if (runtime.ssl_days_remaining <= 0 || runtime.ssl_ok === false) return 'error';
  if (runtime.ssl_days_remaining < 30) return 'error';
  return 'ok';
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
