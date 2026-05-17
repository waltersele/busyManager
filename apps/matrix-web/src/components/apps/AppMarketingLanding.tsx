'use client';

import { CATEGORY_GRADIENTS, CATEGORY_LABELS, SidebarApp } from '@/lib/modules';
import { CATEGORY_ICONS, IconPlus } from '@/components/icons';
import Link from 'next/link';

const DEFAULT_HIGHLIGHTS = [
  'Usa la configuración compartida del negocio',
  'Integración con Leads y alertas',
  'Solo para este local',
];

const SLUG_HIGHLIGHTS: Record<string, string[]> = {
  'web-uptime': [
    'Comprobación periódica de disponibilidad',
    'Alertas por email al caer o recuperarse',
    'Aviso antes de que caduque el certificado SSL',
  ],
  'whatsapp-guardia': [
    'Respuestas fuera de horario con tus documentos',
    'Recoge datos si no puede resolver la consulta',
    'Tono profesional acorde a tu negocio',
  ],
  'resenas-gmb': [
    'Respuestas automáticas en reseñas positivas',
    'Aprobación humana en valoraciones críticas',
    'Alertas al responsable al instante',
  ],
  'reputacion-multicanal': [
    'Google, redes y directorios en un panel',
    'Prioriza comentarios urgentes',
    'Coherencia de marca en las respuestas',
  ],
  'monitor-menciones': [
    'Alertas cuando aparece tu marca online',
    'Incluido gratis en el ecosistema',
    'Configuración por nombre comercial',
  ],
  'seo-pipeline': [
    'Artículos SEO con metadatos on-page',
    'Borradores en WordPress, nunca auto-publicación',
    'Aprobación humana con trazabilidad',
  ],
  'enlaces-rotos': [
    'Escaneo periódico de enlaces rotos',
    'Prioriza qué corregir primero',
    'Alertas si bajan tus keywords clave',
  ],
  'voz-gestion': [
    'Transcribe audios de WhatsApp',
    'Extrae tareas accionables',
    'Menos olvidos en el día a día',
  ],
  'digital-signage': [
    'Pantallas del local actualizables',
    'Menús y ofertas desde el móvil',
    'Próximamente en BusyManager',
  ],
  'video-local': [
    'Vídeos por franja o zona del local',
    'Ideal para clínicas y tiendas',
    'Próximamente en BusyManager',
  ],
  'menu-dinamico': [
    'Carta digital sincronizada',
    'Precios y alérgenos al instante',
    'Próximamente en BusyManager',
  ],
};

function MockChart({ variant }: { variant: 'uptime' | 'social' | 'content' }) {
  if (variant === 'uptime') {
    return (
      <div className="flex h-24 items-end justify-center gap-1 px-4">
        {[92, 98, 100, 100, 88, 100, 100, 95, 100, 100, 72, 100].map((h, i) => (
          <div
            key={i}
            className={`w-2 rounded-t ${h < 90 ? 'bg-red-400' : 'bg-emerald-400'}`}
            style={{ height: `${h * 0.22}%` }}
          />
        ))}
      </div>
    );
  }
  if (variant === 'social') {
    return (
      <p className="py-8 text-center text-3xl tracking-widest text-amber-300">★★★★★</p>
    );
  }
  return (
    <div className="space-y-2 px-6 py-4">
      <div className="h-2 w-full rounded bg-white/30" />
      <div className="h-2 w-4/5 rounded bg-white/20" />
      <div className="h-2 w-full rounded bg-white/20" />
    </div>
  );
}

function chartVariant(category?: string): 'uptime' | 'social' | 'content' {
  if (category === 'monitorizacion') return 'uptime';
  if (category === 'social') return 'social';
  return 'content';
}

export default function AppMarketingLanding({
  app,
  activating,
  onActivate,
}: {
  app: SidebarApp;
  activating: boolean;
  onActivate: () => void;
}) {
  const categoryName = CATEGORY_LABELS[app.category ?? ''] ?? app.category ?? '';
  const gradient = CATEGORY_GRADIENTS[app.category ?? ''] ?? 'from-orange-500 to-amber-600';
  const CatIcon = CATEGORY_ICONS[app.category ?? ''] ?? IconPlus;
  const highlights = SLUG_HIGHLIGHTS[app.slug] ?? DEFAULT_HIGHLIGHTS;
  const heroLine = app.marketing_description ?? app.description ?? 'Herramienta para PYMEs.';
  const longCopy = app.description && app.description !== app.marketing_description ? app.description : null;

  return (
    <div className="max-w-4xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
        {categoryName}
      </p>

      <div
        className={`mt-4 overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-8 text-white shadow-lg`}
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="mb-4 inline-flex rounded-xl bg-white/20 p-3 backdrop-blur">
              <CatIcon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{app.name}</h1>
            <p className="mt-3 max-w-lg text-lg text-white/90">{heroLine}</p>
            {app.is_free && (
              <span className="mt-4 inline-block rounded-full bg-white/25 px-3 py-1 text-sm font-medium">
                Incluida gratis
              </span>
            )}
          </div>
          <div className="w-full max-w-xs rounded-xl bg-white/15 p-2 backdrop-blur md:w-72">
            <MockChart variant={chartVariant(app.category)} />
            <p className="pb-2 text-center text-xs text-white/70">Vista previa</p>
          </div>
        </div>
      </div>

      {longCopy && (
        <div className="mt-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <p className="text-base leading-relaxed text-slate-600">{longCopy}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {highlights.map((text) => (
          <div key={text} className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <span className="text-lg text-emerald-500">✓</span>
            <p className="mt-2 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="btn flex items-center gap-2 px-6 py-3 text-base"
          disabled={activating}
          onClick={onActivate}
        >
          <IconPlus className="h-5 w-5" />
          {activating ? 'Activando…' : 'Activar app'}
        </button>
        <Link href="/dashboard/settings/apps" className="text-sm text-slate-500 hover:text-orange-600">
          Ver todas las apps →
        </Link>
      </div>
    </div>
  );
}
