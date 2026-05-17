'use client';

import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function SettingsTokensPage() {
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    api<{ balance: number; ledger: Record<string, unknown>[] }>('/org/tokens').then((d) => {
      setBalance(d.balance);
      setLedger(d.ledger ?? []);
    });
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Tokens IA</h2>
      <p className="mt-1 text-sm text-slate-500">
        Pool compartido de la organización. Las apps con IA consumen desde aquí.
      </p>
      <div className="card mb-6 mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Saldo</p>
        <p className="mt-2 text-4xl font-semibold text-orange-600">{balance.toLocaleString()}</p>
      </div>
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Historial</h3>
      <div className="space-y-2">
        {ledger.length === 0 && (
          <p className="text-sm text-slate-500">Sin movimientos aún.</p>
        )}
        {ledger.map((row, i) => (
          <div key={i} className="card flex justify-between gap-4 py-3 text-sm">
            <span className={Number(row.amount) < 0 ? 'text-red-600' : 'text-emerald-600'}>
              {String(row.amount)}
            </span>
            <span className="text-slate-600">{String(row.module_slug ?? row.type)}</span>
            <span className="text-slate-400">{String(row.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
