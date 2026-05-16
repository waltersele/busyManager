export const CATEGORY_LABELS: Record<string, string> = {
  captacion: 'Captación',
  social: 'Social',
  contenido: 'Contenido',
  gestion: 'Gestión',
  monitorizacion: 'Monitorización',
  visual: 'Visual',
};

export const CATEGORY_ORDER = [
  'captacion',
  'social',
  'contenido',
  'gestion',
  'monitorizacion',
  'visual',
] as const;

export type AppStatus = 'active' | 'inactive' | 'coming_soon';

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
