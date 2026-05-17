'use client';

import {
  CATEGORY_ICONS,
  IconChevron,
  IconHome,
  IconLeads,
  IconLock,
  IconSettings,
  IconStore,
} from '@/components/icons';
import { api, clearToken, getBusinessId, setBusinessId } from '@/lib/api';
import {
  AppsSidebarResponse,
  AppStatus,
  CATEGORY_LABELS,
  SidebarApp,
  SidebarCategory,
  sortSuiteApps,
} from '@/lib/modules';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface Business {
  id: number;
  name: string;
  slug: string;
}

interface UserData {
  user: {
    organizations: Array<{
      id: number;
      name: string;
      businesses: Business[];
    }>;
    email: string;
  };
}

function SuiteAppLink({ app, pathname }: { app: SidebarApp; pathname: string }) {
  const href = `/dashboard/apps/${app.slug}`;
  const isRouteActive = pathname === href || pathname.startsWith(`${href}/`);
  const status: AppStatus = app.status;

  if (status === 'coming_soon') {
    return (
      <span
        className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 opacity-60"
        title="Próximamente"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
        <span className="min-w-0 flex-1 truncate">{app.name}</span>
        {app.is_free && (
          <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-slate-500">
            Gratis
          </span>
        )}
        <span className="shrink-0 text-[10px] uppercase">Pronto</span>
      </span>
    );
  }

  const isActive = status === 'active';
  const isInactive = status === 'inactive';

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
        isRouteActive && isActive
          ? 'bg-orange-50 font-medium text-orange-700'
          : isRouteActive && isInactive
            ? 'bg-slate-100 font-medium text-slate-700'
            : isActive
              ? 'text-slate-700 hover:bg-slate-50'
              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      } ${isInactive ? 'opacity-70' : ''}`}
    >
      {isActive ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
      ) : (
        <IconLock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      )}
      <span className="min-w-0 flex-1 truncate">{app.name}</span>
      {app.is_free && (
        <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-700">
          Gratis
        </span>
      )}
    </Link>
  );
}

function CategorySection({
  cat,
  expanded,
  onToggle,
}: {
  cat: SidebarCategory;
  expanded: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const sortedApps = sortSuiteApps(cat.apps);
  const activeCount = sortedApps.filter((a) => a.status === 'active').length;
  const CatIcon = CATEGORY_ICONS[cat.id] ?? IconStore;

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <CatIcon className="shrink-0 text-slate-400" />
        <span className="flex-1 truncate">{CATEGORY_LABELS[cat.id] ?? cat.id}</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
            {activeCount}
          </span>
        )}
        <IconChevron open={expanded} className="shrink-0 text-slate-400" />
      </button>

      {expanded && (
        <div className="ml-2 space-y-0.5 border-l border-slate-100 pl-2">
          {sortedApps.map((app) => (
            <SuiteAppLink key={app.slug} app={app} pathname={pathname} />
          ))}
          <Link
            href="/dashboard/settings/apps"
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] text-slate-400 hover:text-orange-600"
          >
            Ver todas las apps
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData['user'] | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [sidebar, setSidebar] = useState<AppsSidebarResponse | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const businessId = getBusinessId();

  const loadSidebar = useCallback(() => {
    if (!businessId) return;
    api<AppsSidebarResponse>(`/businesses/${businessId}/apps-sidebar`).then((data) => {
      setSidebar(data);
      const initial: Record<string, boolean> = {};
      data.categories.forEach((c) => {
        initial[c.id] = c.apps.some((a) => a.status === 'active') || c.apps.length > 0;
      });
      setExpanded((prev) => ({ ...initial, ...prev }));
    });
  }, [businessId]);

  useEffect(() => {
    api<UserData>('/auth/me').then((data) => {
      setUser(data.user);
      const list = data.user.organizations[0]?.businesses ?? [];
      setBusinesses(list);
      if (list.length && !getBusinessId()) setBusinessId(list[0].id);
    });
  }, []);

  useEffect(() => {
    loadSidebar();
  }, [loadSidebar, pathname]);

  const settingsActive = pathname.startsWith('/dashboard/settings');

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-5">
        <p className="text-lg font-semibold tracking-tight text-slate-900">BusyManager</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          {user?.organizations[0]?.name}
        </p>
        {businesses.length > 0 && (
          <select
            className="mt-3 text-xs"
            value={businessId ?? ''}
            onChange={(e) => {
              setBusinessId(Number(e.target.value));
              window.location.href = '/dashboard';
            }}
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <Link
          href="/dashboard"
          className={`mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
            pathname === '/dashboard'
              ? 'bg-slate-100 font-medium text-slate-900'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <IconHome className="text-slate-400" />
          Inicio
        </Link>
        <Link
          href="/dashboard/leads"
          className={`mb-3 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
            pathname === '/dashboard/leads'
              ? 'bg-slate-100 font-medium text-slate-900'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <IconLeads className="text-slate-400" />
          Leads
        </Link>

        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Mi suite
        </p>

        {sidebar?.categories.map((cat) => (
          <CategorySection
            key={cat.id}
            cat={cat}
            expanded={expanded[cat.id] ?? false}
            onToggle={() => setExpanded((e) => ({ ...e, [cat.id]: !e[cat.id] }))}
          />
        ))}
      </nav>

      <div className="border-t border-slate-100 px-2 py-3">
        <Link
          href="/dashboard/settings/business"
          className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
            settingsActive
              ? 'bg-orange-50 font-medium text-orange-700'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <IconSettings className="shrink-0 opacity-70" />
          Configuración
        </Link>
        <button
          type="button"
          onClick={() => {
            clearToken();
            router.push('/login');
          }}
          className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
