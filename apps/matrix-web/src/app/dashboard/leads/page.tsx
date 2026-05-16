'use client';

import PageHeader from '@/components/PageHeader';
import { api, getBusinessId } from '@/lib/api';
import { useEffect, useState } from 'react';

interface Lead {
  id: number;
  source: string;
  status: string;
  contact_name: string;
  contact_email: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const businessId = getBusinessId();

  useEffect(() => {
    if (!businessId) return;
    api<{ data: Lead[] }>(`/businesses/${businessId}/leads`).then((r) =>
      setLeads(r.data ?? []),
    );
  }, [businessId]);

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Bandeja transversal: todos los módulos que crean leads los verás aquí."
      />
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Origen</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3 font-medium text-slate-900">{l.contact_name}</td>
                <td className="px-5 py-3 text-slate-600">{l.contact_email}</td>
                <td className="px-5 py-3 text-slate-600">{l.source}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">No hay leads todavía.</p>
        )}
      </div>
    </div>
  );
}
