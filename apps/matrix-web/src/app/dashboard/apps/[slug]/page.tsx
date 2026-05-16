'use client';

import PageHeader from '@/components/PageHeader';
import { IconPlus } from '@/components/icons';
import { api, getBusinessId } from '@/lib/api';
import { CATEGORY_LABELS, SidebarApp } from '@/lib/modules';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AppPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const businessId = getBusinessId();
  const [app, setApp] = useState<SidebarApp | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (!businessId || !slug) return;
    api<SidebarApp>(`/businesses/${businessId}/apps/${slug}`)
      .then(setApp)
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [businessId, slug]);

  async function addToSuite() {
    if (!businessId || !slug) return;
    setActivating(true);
    try {
      const res = await api<{ api_key?: string }>(
        `/businesses/${businessId}/subscriptions/${slug}/activate`,
        { method: 'POST' },
      );
      if (res.api_key) setApiKey(res.api_key);
      setApp((a) => (a ? { ...a, status: 'active' } : a));
      router.push(`/dashboard/apps/${slug}`);
    } finally {
      setActivating(false);
    }
  }

  async function removeFromSuite() {
    await api(`/businesses/${businessId}/subscriptions/${slug}`, { method: 'DELETE' });
    setApp((a) => (a ? { ...a, status: 'inactive' } : a));
    setApiKey(null);
  }

  if (loading) return <p className="text-sm text-slate-500">Cargando…</p>;
  if (!app) return <p className="text-sm text-red-600">App no encontrada</p>;

  const categoryName = CATEGORY_LABELS[app.category ?? ''] ?? app.category;

  if (app.status === 'active') {
    return (
      <div>
        <PageHeader
          title={app.name}
          description={`App activa en tu suite · ${categoryName}`}
          action={
            <button type="button" className="btn-ghost" onClick={removeFromSuite}>
              Quitar de mi suite
            </button>
          }
        />
        {apiKey && (
          <div className="card mb-6 border-orange-200 bg-orange-50">
            <p className="text-sm font-medium text-orange-900">API key (módulo alumno)</p>
            <code className="mt-2 block break-all text-xs text-orange-800">{apiKey}</code>
          </div>
        )}
        <div className="card">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Activa
          </span>
          {slug === 'web-uptime' && (
            <p className="mt-4 text-sm text-slate-600">
              Configura la URL en{' '}
              <Link href="/dashboard/settings" className="font-medium text-orange-600 hover:underline">
                Configuración → Web
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    );
  }

  if (app.status === 'coming_soon') {
    return (
      <div>
        <PageHeader title={app.name} description={categoryName} />
        <div className="card border-dashed bg-slate-50 text-center">
          <p className="text-lg font-medium text-slate-700">Próximamente</p>
          <p className="mt-2 text-sm text-slate-500">Estamos terminando esta app.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
        {categoryName}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{app.name}</h1>
      <p className="mt-4 text-lg text-slate-600">
        {app.marketing_description ?? app.description ?? 'Herramienta para PYMEs.'}
      </p>

      <div className="mt-8 card">
        <ul className="space-y-3 text-sm text-slate-600">
          <li>✓ Usa la configuración compartida del negocio</li>
          <li>✓ Integración con Leads y alertas</li>
          <li>✓ Solo para este local</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div>
          <p className="text-sm text-slate-500">Precio</p>
          <p className="text-2xl font-bold text-slate-900">
            {app.is_free ? 'Gratis' : app.price_label}
          </p>
        </div>
        <button
          type="button"
          className="btn flex items-center gap-2"
          disabled={activating}
          onClick={addToSuite}
        >
          {app.is_free && <IconPlus className="h-5 w-5" />}
          {activating
            ? 'Añadiendo…'
            : app.is_free
              ? 'Añadir a mi suite'
              : `Añadir a mi suite · ${app.price_label}`}
        </button>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        MVP: activación inmediata sin pasarela de pago.
      </p>

      <Link
        href={`/dashboard/catalog?category=${app.category}`}
        className="mt-4 inline-block text-sm text-orange-600 hover:underline"
      >
        ← Catálogo {categoryName}
      </Link>
    </div>
  );
}
