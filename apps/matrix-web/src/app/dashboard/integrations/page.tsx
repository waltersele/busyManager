'use client';

import PageHeader from '@/components/PageHeader';
import { api } from '@/lib/api';
import { FormEvent, useEffect, useState } from 'react';

interface Connection {
  id: number;
  provider: string;
  scope: string;
  label: string;
}

export default function IntegrationsPage() {
  const [list, setList] = useState<Connection[]>([]);
  const [provider, setProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');

  function load() {
    api<{ data: Connection[] }>('/org/connections').then((r) => setList(r.data));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    await api('/org/connections', {
      method: 'POST',
      body: JSON.stringify({
        provider,
        scope: 'organization',
        credentials: { api_key: apiKey },
        label: provider,
      }),
    });
    setApiKey('');
    load();
  }

  return (
    <div>
      <PageHeader
        title="Integraciones"
        description="Conexiones a proveedores (IA, email, WhatsApp…). Se configuran una vez y las apps las reutilizan."
      />
      <form onSubmit={create} className="card mb-6 flex flex-wrap gap-3">
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="gemini">Google Gemini</option>
          <option value="email">Email</option>
          <option value="whatsapp">Meta WhatsApp</option>
        </select>
        <input
          className="min-w-[200px] flex-1"
          placeholder="API key o credencial"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
        <button type="submit" className="btn">
          Añadir (nivel organización)
        </button>
      </form>
      <div className="space-y-2">
        {list.map((c) => (
          <div key={c.id} className="card flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-slate-900">{c.label}</p>
              <p className="text-xs text-slate-500">
                {c.provider} · {c.scope}
              </p>
            </div>
            <button
              type="button"
              className="text-sm text-red-600 hover:underline"
              onClick={() => api(`/org/connections/${c.id}`, { method: 'DELETE' }).then(load)}
            >
              Eliminar
            </button>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-sm text-slate-500">Sin integraciones configuradas.</p>
        )}
      </div>
    </div>
  );
}
