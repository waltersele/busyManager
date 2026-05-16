'use client';

import { api, getBusinessId } from '@/lib/api';
import { FormEvent, useEffect, useState } from 'react';

interface Business {
  id: number;
  name: string;
  slug: string;
  settings?: { monitor_url?: string };
}

export default function BusinessesPage() {
  const [list, setList] = useState<Business[]>([]);
  const [name, setName] = useState('');
  const [monitorUrl, setMonitorUrl] = useState('');

  function load() {
    api<{ data: Business[] }>('/org/businesses').then((r) => setList(r.data));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    await api('/org/businesses', {
      method: 'POST',
      body: JSON.stringify({
        name,
        settings: monitorUrl ? { monitor_url: monitorUrl } : undefined,
      }),
    });
    setName('');
    setMonitorUrl('');
    load();
  }

  async function saveMonitorUrl(business: Business) {
    await api(`/org/businesses/${business.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        settings: { ...business.settings, monitor_url: monitorUrl },
      }),
    });
    load();
  }

  const editingId = getBusinessId();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Negocios</h1>
      <form onSubmit={create} className="card mb-6 flex flex-wrap gap-3">
        <input
          placeholder="Nombre del negocio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="URL monitor (opcional)"
          value={monitorUrl}
          onChange={(e) => setMonitorUrl(e.target.value)}
        />
        <button type="submit" className="btn">
          Crear
        </button>
      </form>
      <div className="space-y-3">
        {list.map((b) => (
          <div key={b.id} className="card flex items-center justify-between">
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-xs text-muted">{b.slug}</p>
              <p className="text-xs text-muted">
                URL: {b.settings?.monitor_url ?? '—'}
              </p>
            </div>
            {String(b.id) === editingId && (
              <button
                className="btn-ghost text-xs"
                onClick={() => {
                  setMonitorUrl(b.settings?.monitor_url ?? '');
                  saveMonitorUrl(b);
                }}
              >
                Guardar URL monitor
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
