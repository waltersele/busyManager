'use client';

import AppComingSoon from '@/components/apps/AppComingSoon';
import AppMarketingLanding from '@/components/apps/AppMarketingLanding';
import AppWorkspace from '@/components/apps/AppWorkspace';
import { api, getBusinessId } from '@/lib/api';
import { SidebarApp } from '@/lib/modules';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AppPage() {
  const { slug } = useParams<{ slug: string }>();
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
    } finally {
      setActivating(false);
    }
  }

  async function removeFromSuite() {
    if (!businessId || !slug) return;
    await api(`/businesses/${businessId}/subscriptions/${slug}`, { method: 'DELETE' });
    setApp((a) => (a ? { ...a, status: 'inactive' } : a));
    setApiKey(null);
  }

  if (loading) return <p className="text-sm text-slate-500">Cargando…</p>;
  if (!app) return <p className="text-sm text-red-600">App no encontrada</p>;

  if (app.status === 'coming_soon') {
    return <AppComingSoon app={app} />;
  }

  if (app.status === 'active') {
    return (
      <AppWorkspace
        app={app}
        slug={slug}
        apiKey={apiKey}
        onDeactivate={removeFromSuite}
      />
    );
  }

  return (
    <AppMarketingLanding app={app} activating={activating} onActivate={addToSuite} />
  );
}
