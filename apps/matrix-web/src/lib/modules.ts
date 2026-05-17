export const CATEGORY_LABELS: Record<string, string> = {
  captacion: 'Captación',
  social: 'Social',
  contenido: 'Contenido',
  gestion: 'Gestión',
  monitorizacion: 'Monitorización',
  visual: 'Visual',
};

/** Ocultar precios en UI hasta activar facturación */
export const SHOW_PRICING = false;

export const CATEGORY_GRADIENTS: Record<string, string> = {
  captacion: 'from-violet-500 to-purple-600',
  social: 'from-pink-500 to-rose-600',
  contenido: 'from-blue-500 to-cyan-600',
  gestion: 'from-amber-500 to-orange-600',
  monitorizacion: 'from-emerald-500 to-teal-600',
  visual: 'from-indigo-500 to-violet-600',
};

/** Alineado con API: solo categorías con apps visibles en catálogo. */
export const CATEGORY_ORDER = [
  'social',
  'contenido',
  'gestion',
  'monitorizacion',
  'visual',
] as const;

export type AppStatus = 'active' | 'inactive' | 'coming_soon';

const SUITE_STATUS_ORDER: Record<AppStatus, number> = {
  active: 0,
  inactive: 1,
  coming_soon: 2,
};

/** Activas primero, luego inactivas, al final «próximamente». */
export function sortSuiteApps(apps: SidebarApp[]): SidebarApp[] {
  return [...apps].sort((a, b) => {
    const byStatus = SUITE_STATUS_ORDER[a.status] - SUITE_STATUS_ORDER[b.status];
    if (byStatus !== 0) return byStatus;
    return a.name.localeCompare(b.name, 'es');
  });
}

export interface SidebarApp {
  slug: string;
  name: string;
  description?: string | null;
  marketing_description?: string | null;
  category?: string;
  is_available: boolean;
  is_free: boolean;
  price_monthly_cents: number;
  price_label: string;
  status: AppStatus;
}

export interface SidebarCategory {
  id: string;
  apps: SidebarApp[];
}

export interface AppsSidebarResponse {
  business: { id: number; name: string; slug: string };
  categories: SidebarCategory[];
}

export function formatPrice(cents: number, isFree: boolean): string {
  if (isFree) return 'Gratis';
  return `${(cents / 100).toFixed(2).replace('.', ',')} €/mes`;
}
