'use client';

import AppDiscoveryCard from '@/components/apps/AppDiscoveryCard';
import { api, getBusinessId } from '@/lib/api';
import { AppsSidebarResponse, CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/modules';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function AppsContent() {
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
  const activeTotal =
    sidebar?.categories.reduce(
      (n, c) => n + c.apps.filter((a) => a.status === 'active').length,
      0,
    ) ?? 0;

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Apps</h2>
      <p className="mt-1 text-sm text-slate-500">
        Descubre y activa herramientas para tu negocio. {activeTotal} activa
        {activeTotal === 1 ? '' : 's'} en tu suite.
      </p>

      <div className="mb-6 mt-6 flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setActiveCategory(id);
              router.replace(`/dashboard/settings/apps?category=${id}`, { scroll: false });
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

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {current?.apps.map((app) => (
          <AppDiscoveryCard key={app.slug} app={app} />
        ))}
      </div>
    </div>
  );
}

export default function SettingsAppsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Cargando apps…</p>}>
      <AppsContent />
    </Suspense>
  );
}
