'use client';

import PageHeader from '@/components/PageHeader';
import { SidebarApp } from '@/lib/modules';
import WebUptimeDashboard from './WebUptimeDashboard';

export default function AppWorkspace({
  app,
  slug,
  apiKey,
  onDeactivate,
}: {
  app: SidebarApp;
  slug: string;
  apiKey: string | null;
  onDeactivate: () => void;
}) {
  if (slug === 'web-uptime') {
    return <WebUptimeDashboard appName={app.name} onDeactivate={onDeactivate} />;
  }

  return (
    <div>
      <PageHeader
        title={app.name}
        description="App activa en tu suite"
        action={
          <button type="button" className="btn-ghost" onClick={onDeactivate}>
            Desactivar app
          </button>
        }
      />
      {apiKey && (
        <div className="card mb-6 border-orange-200 bg-orange-50">
          <p className="text-sm font-medium text-orange-900">API key (módulo externo)</p>
          <code className="mt-2 block break-all text-xs text-orange-800">{apiKey}</code>
        </div>
      )}
      <div className="card">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Activa
        </span>
        <p className="mt-4 text-sm text-slate-600">
          El panel operativo de esta app está en desarrollo. Usa la API key para conectar tu
          módulo.
        </p>
      </div>
    </div>
  );
}
