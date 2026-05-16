'use client';

import { api } from '@/lib/api';
import { FormEvent, useEffect, useState } from 'react';

interface Connection {
  id: number;
  provider: string;
  scope: string;
  label: string;
}

export default function ConnectionsPage() {
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
      <h1 className="mb-6 text-2xl font-bold">Provider Connections</h1>
      <form onSubmit={create} className="card mb-6 flex flex-wrap gap-3">
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="gemini">Google Gemini</option>
          <option value="email">Email</option>
          <option value="whatsapp">Meta WhatsApp</option>
        </select>
        <input
          placeholder="API key / credencial"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
        <button type="submit" className="btn">
          Guardar (nivel org)
        </button>
      </form>
      <div className="space-y-2">
        {list.map((c) => (
          <div key={c.id} className="card flex justify-between">
            <span>
              {c.label} — <span className="text-muted">{c.scope}</span>
            </span>
            <button
              type="button"
              className="text-xs text-red-400"
              onClick={() =>
                api(`/org/connections/${c.id}`, { method: 'DELETE' }).then(load)
              }
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
