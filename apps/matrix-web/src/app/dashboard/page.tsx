'use client';

import PageHeader from '@/components/PageHeader';
import { api, getBusinessId } from '@/lib/api';
import { AppsSidebarResponse } from '@/lib/modules';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardHome() {
  const [balance, setBalance] = useState<number | null>(null);
  const [activeCount, setActiveCount] = useState(0);
  const businessId = getBusinessId();

  useEffect(() => {
    api<{ balance: number }>('/org/tokens').then((d) => setBalance(d.balance));
    if (businessId) {
      api<AppsSidebarResponse>(`/businesses/${businessId}/apps-sidebar`).then((d) => {
        const n = d.categories.reduce(
          (acc, c) => acc + c.apps.filter((a) => a.status === 'active').length,
          0,
        );
        setActiveCount(n);
      });
    }
  }, [businessId]);

  return (
    <div>
      <PageHeader
        title="Inicio"
        description="Resumen de tu negocio. Activa apps desde Mi suite o Configuración → Apps."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Apps activas
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{activeCount}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Tokens IA
          </p>
          <p className="mt-2 text-3xl font-semibold text-orange-600">
            {balance?.toLocaleString() ?? '—'}
          </p>
        </div>
        <Link href="/dashboard/settings/business" className="card transition hover:border-orange-200 hover:shadow-md">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Configuración
          </p>
          <p className="mt-2 text-sm text-slate-700">
            Web, fiscal, contacto… compartido por todas las apps
          </p>
        </Link>
      </div>
      <div className="mt-8 card">
        <h2 className="font-semibold text-slate-900">Lead Workbench</h2>
        <p className="mt-1 text-sm text-slate-500">
          Todos los leads de tus apps en un solo sitio.
        </p>
        <Link href="/dashboard/leads" className="btn mt-4 inline-block">
          Ver leads
        </Link>
      </div>
    </div>
  );
}
