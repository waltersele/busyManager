'use client';

import PageHeader from '@/components/PageHeader';
import { IconPlus } from '@/components/icons';
import { api, getBusinessId } from '@/lib/api';
import {
  AppsSidebarResponse,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  SidebarApp,
} from '@/lib/modules';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');
  const [sidebar, setSidebar] = useState<AppsSidebarResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState(
    categoryParam ?? CATEGORY_ORDER[0],
  );
  const businessId = getBusinessId();

  useEffect(() => {
    if (!businessId) return;
    api<AppsSidebarResponse>(`/businesses/${businessId}/apps-sidebar`).then(setSidebar);
  }, [businessId]);

  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  const current = sidebar?.categories.find((c) => c.id === activeCategory);

  return (
    <div>
      <PageHeader
        title="Tienda de apps"
        description="Explora el catálogo por temática. Las gratuitas se añaden con un clic; las de pago se activan en tu suite."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setActiveCategory(id);
              router.replace(`/dashboard/catalog?category=${id}`, { scroll: false });
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === id
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {CATEGORY_LABELS[id]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {current?.apps.map((app) => (
          <AppCatalogCard key={app.slug} app={app} />
        ))}
      </div>
    </div>
  );
}

function AppCatalogCard({ app }: { app: SidebarApp }) {
  const isActive = app.status === 'active';
  const isSoon = app.status === 'coming_soon';

  return (
    <div
      className={`card flex flex-col ${
        isActive ? 'ring-2 ring-emerald-200' : isSoon ? 'opacity-60' : ''
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{app.name}</h3>
        {isActive && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
            En tu suite
          </span>
        )}
        {isSoon && (
          <span className="shrink-0 text-[10px] uppercase text-slate-400">Pronto</span>
        )}
      </div>
      <p className="mb-4 flex-1 text-sm text-slate-500">
        {app.marketing_description ?? app.description ?? 'App del ecosistema BusyManager.'}
      </p>
      <p className="mb-4 text-lg font-semibold text-slate-900">
        {app.is_free ? 'Gratis' : app.price_label}
      </p>
      {isActive ? (
        <Link href={`/dashboard/apps/${app.slug}`} className="btn-ghost text-center text-sm">
          Abrir app
        </Link>
      ) : isSoon ? (
        <button type="button" disabled className="btn-ghost cursor-not-allowed opacity-50">
          Próximamente
        </button>
      ) : (
        <Link href={`/dashboard/apps/${app.slug}`} className="btn flex items-center justify-center gap-2">
          {app.is_free ? (
            <>
              <IconPlus className="h-4 w-4" />
              Añadir gratis
            </>
          ) : (
            'Ver y añadir a mi suite'
          )}
        </Link>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Cargando catálogo…</p>}>
      <CatalogContent />
    </Suspense>
  );
}

