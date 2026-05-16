'use client';

import { api, getBusinessId } from '@/lib/api';
import { useEffect, useState } from 'react';

interface Module {
  id: number;
  slug: string;
  name: string;
  category: string;
  is_available: boolean;
}

interface Sub {
  id: number;
  is_active: boolean;
  module: Module;
}

export default function ModulesPage() {
  const [catalog, setCatalog] = useState<Module[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const businessId = getBusinessId();

  function loadSubs() {
    if (!businessId) return;
    api<{ data: Sub[] }>(`/businesses/${businessId}/subscriptions`).then((r) =>
      setSubs(r.data),
    );
  }

  useEffect(() => {
    api<{ data: Module[] }>('/org/modules').then((r) => setCatalog(r.data));
    loadSubs();
  }, [businessId]);

  async function activate(slug: string) {
    const res = await api<{ api_key: string }>(
      `/businesses/${businessId}/subscriptions/${slug}/activate`,
      { method: 'POST' },
    );
    setApiKey(res.api_key);
    loadSubs();
  }

  async function deactivate(slug: string) {
    await api(`/businesses/${businessId}/subscriptions/${slug}`, { method: 'DELETE' });
    loadSubs();
  }

  const activeSlugs = new Set(subs.filter((s) => s.is_active).map((s) => s.module.slug));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Módulos</h1>
      {apiKey ? (
        <div className="card mb-4 border-accent">
          <p className="text-sm text-muted">API key generada (cópiala ahora):</p>
          <code className="mt-2 block break-all text-xs text-accent">{apiKey}</code>
        </div>
      ) : null}
      <div className="space-y-2">
        {catalog.map((m) => (
          <div key={m.slug} className="card flex items-center justify-between">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-muted">
                {m.category} · {m.slug}
                {!m.is_available ? ' · en desarrollo' : ''}
              </p>
            </div>
            {m.is_available ? (
              activeSlugs.has(m.slug) ? (
                <button type="button" className="btn-ghost text-xs" onClick={() => deactivate(m.slug)}>
                  Desactivar
                </button>
              ) : (
                <button type="button" className="btn text-xs" onClick={() => activate(m.slug)}>
                  Activar
                </button>
              )
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
