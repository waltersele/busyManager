'use client';

import { api, getBusinessId } from '@/lib/api';
import { FormEvent, useEffect, useState } from 'react';

interface Webhook {
  id: number;
  url: string;
  events: string[];
}

export default function WebhooksPage() {
  const [list, setList] = useState<Webhook[]>([]);
  const [url, setUrl] = useState('http://localhost:9090/webhook-test');
  const businessId = getBusinessId();

  function load() {
    if (!businessId) return;
    api<{ data: Webhook[] }>(`/businesses/${businessId}/webhooks`).then((r) =>
      setList(r.data),
    );
  }

  useEffect(() => {
    load();
  }, [businessId]);

  async function create(e: FormEvent) {
    e.preventDefault();
    await api(`/businesses/${businessId}/webhooks`, {
      method: 'POST',
      body: JSON.stringify({ url, events: ['*'] }),
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Webhooks</h1>
      <form onSubmit={create} className="card mb-6 flex gap-3">
        <input className="flex-1" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button type="submit" className="btn">
          Añadir
        </button>
      </form>
      <div className="space-y-2">
        {list.map((w) => (
          <div key={w.id} className="card flex justify-between">
            <code className="text-xs">{w.url}</code>
            <button
              type="button"
              className="text-xs text-red-400"
              onClick={() =>
                api(`/businesses/${businessId}/webhooks/${w.id}`, { method: 'DELETE' }).then(
                  load,
                )
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
