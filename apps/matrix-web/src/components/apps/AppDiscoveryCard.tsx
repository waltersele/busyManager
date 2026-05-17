'use client';

import {
  CATEGORY_GRADIENTS,
  CATEGORY_LABELS,
  SidebarApp,
} from '@/lib/modules';
import { CATEGORY_ICONS } from '@/components/icons';
import Link from 'next/link';

function statusBadge(app: SidebarApp) {
  if (app.status === 'active') {
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
        Activa
      </span>
    );
  }
  if (app.status === 'coming_soon') {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">
        Próximamente
      </span>
    );
  }
  return (
    <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-orange-700">
      Disponible
    </span>
  );
}

function MiniPreview({ category, slug }: { category?: string; slug: string }) {
  if (category === 'monitorizacion' || slug === 'web-uptime') {
    return (
      <div className="flex h-14 items-end justify-center gap-0.5 px-3">
        {[100, 100, 72, 100, 100, 98].map((h, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-t ${h < 90 ? 'bg-red-400/80' : 'bg-white/70'}`}
            style={{ height: `${h * 0.12}%` }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex h-14 items-center justify-center text-2xl text-white/60">◆</div>
  );
}

export default function AppDiscoveryCard({ app }: { app: SidebarApp }) {
  const gradient = CATEGORY_GRADIENTS[app.category ?? ''] ?? 'from-orange-500 to-amber-600';
  const CatIcon = CATEGORY_ICONS[app.category ?? ''] ?? CATEGORY_ICONS.social;
  const isSoon = app.status === 'coming_soon';
  const href = isSoon ? '#' : `/dashboard/apps/${app.slug}`;

  const inner = (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        app.status === 'active'
          ? 'border-emerald-200 ring-1 ring-emerald-100'
          : 'border-slate-200/80 hover:border-orange-200'
      } ${isSoon ? 'pointer-events-none opacity-60' : ''}`}
    >
      <div className={`bg-gradient-to-br ${gradient} px-5 pb-4 pt-5 text-white`}>
        <div className="flex items-start justify-between gap-2">
          <div className="rounded-lg bg-white/20 p-2 backdrop-blur">
            <CatIcon className="h-6 w-6" />
          </div>
          {statusBadge(app)}
        </div>
        <MiniPreview category={app.category} slug={app.slug} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-slate-900 group-hover:text-orange-700">{app.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
          {app.marketing_description ?? app.description ?? 'App del ecosistema BusyManager.'}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
          {CATEGORY_LABELS[app.category ?? ''] ?? app.category}
        </p>
        <span className="mt-4 inline-flex text-sm font-medium text-orange-600">
          {app.status === 'active'
            ? 'Abrir app →'
            : isSoon
              ? 'Próximamente'
              : 'Descubrir →'}
        </span>
        {app.is_free && app.status !== 'coming_soon' && (
          <span className="mt-1 text-xs text-emerald-600">Gratis</span>
        )}
      </div>
    </article>
  );

  if (isSoon) return inner;
  return <Link href={href}>{inner}</Link>;
}
