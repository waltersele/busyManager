'use client';

import PageHeader from '@/components/PageHeader';
import { CATEGORY_LABELS, SidebarApp } from '@/lib/modules';

export default function AppComingSoon({ app }: { app: SidebarApp }) {
  const categoryName = CATEGORY_LABELS[app.category ?? ''] ?? app.category;

  return (
    <div className="max-w-2xl">
      <PageHeader title={app.name} description={categoryName ?? ''} />
      <div className="overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-12 text-center">
        <p className="text-6xl">🚀</p>
        <p className="mt-4 text-xl font-semibold text-slate-800">Próximamente</p>
        <p className="mt-2 text-sm text-slate-500">
          Estamos terminando esta app. Mientras tanto, explora otras en Configuración → Apps.
        </p>
      </div>
    </div>
  );
}
