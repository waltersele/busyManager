'use client';

import PageHeader from '@/components/PageHeader';
import {
  IconBuilding,
  IconContact,
  IconFiscal,
  IconIdentity,
  IconWeb,
} from '@/components/icons';
import { api, getBusinessId } from '@/lib/api';
import { BusinessSettings, EMPTY_SETTINGS } from '@/lib/settings';
import { FormEvent, useEffect, useState } from 'react';

const TABS = [
  { id: 'general', label: 'Negocio', Icon: IconBuilding },
  { id: 'identity', label: 'Identidad', Icon: IconIdentity },
  { id: 'web', label: 'Web', Icon: IconWeb },
  { id: 'fiscal', label: 'Fiscal', Icon: IconFiscal },
  { id: 'contact', label: 'Contacto', Icon: IconContact },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function SettingsPage() {
  const businessId = getBusinessId();
  const [tab, setTab] = useState<TabId>('general');
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('Europe/Madrid');
  const [settings, setSettings] = useState<BusinessSettings>(EMPTY_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;
    api<{ name: string; timezone: string; settings: BusinessSettings }>(
      `/businesses/${businessId}/settings`,
    ).then((d) => {
      setName(d.name);
      setTimezone(d.timezone);
      setSettings({ ...EMPTY_SETTINGS, ...d.settings });
      setLoading(false);
    });
  }, [businessId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!businessId) return;
    await api(`/businesses/${businessId}/settings`, {
      method: 'PATCH',
      body: JSON.stringify({ name, timezone, settings }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function patchSection<K extends keyof BusinessSettings>(
    section: K,
    field: keyof BusinessSettings[K],
    value: string,
  ) {
    setSettings((s) => ({
      ...s,
      [section]: { ...s[section], [field]: value },
    }));
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando…</p>;
  }

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Configuración"
        description="Datos compartidos por todas las apps. Configúralo una vez y cada módulo los usará automáticamente."
      />

      <form onSubmit={onSubmit}>
        <div className="flex gap-6">
          <nav className="w-48 shrink-0 space-y-1">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  tab === id
                    ? 'bg-orange-50 font-medium text-orange-700 shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                <Icon className={tab === id ? 'text-orange-600' : 'text-slate-400'} />
                {label}
              </button>
            ))}
          </nav>

          <div className="card min-h-[360px] flex-1">
            {tab === 'general' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="label">Nombre del local</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="label">Zona horaria</label>
                  <input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                </div>
              </div>
            )}

            {tab === 'identity' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">Nombre comercial</label>
                  <input
                    value={settings.identity.trade_name}
                    onChange={(e) => patchSection('identity', 'trade_name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Razón social</label>
                  <input
                    value={settings.identity.legal_name}
                    onChange={(e) => patchSection('identity', 'legal_name', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">URL del logo</label>
                  <input
                    value={settings.identity.logo_url}
                    onChange={(e) => patchSection('identity', 'logo_url', e.target.value)}
                  />
                </div>
              </div>
            )}

            {tab === 'web' && (
              <div className="space-y-4">
                <div>
                  <label className="label">URL de la web</label>
                  <input
                    type="url"
                    placeholder="https://tu-negocio.com"
                    value={settings.web.url}
                    onChange={(e) => patchSection('web', 'url', e.target.value)}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Web caída, SEO, enlaces rotos y alertas de tráfico usan esta URL.
                  </p>
                </div>
                <div className="max-w-xs">
                  <label className="label">Idioma principal</label>
                  <select
                    value={settings.web.language}
                    onChange={(e) => patchSection('web', 'language', e.target.value)}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            )}

            {tab === 'fiscal' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">CIF / NIF</label>
                  <input
                    value={settings.fiscal.tax_id}
                    onChange={(e) => patchSection('fiscal', 'tax_id', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Ciudad</label>
                  <input
                    value={settings.fiscal.city}
                    onChange={(e) => patchSection('fiscal', 'city', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Dirección fiscal</label>
                  <input
                    value={settings.fiscal.address}
                    onChange={(e) => patchSection('fiscal', 'address', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Código postal</label>
                  <input
                    value={settings.fiscal.postal_code}
                    onChange={(e) => patchSection('fiscal', 'postal_code', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">País</label>
                  <input
                    value={settings.fiscal.country}
                    onChange={(e) => patchSection('fiscal', 'country', e.target.value)}
                  />
                </div>
              </div>
            )}

            {tab === 'contact' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">Teléfono público</label>
                  <input
                    value={settings.contact.phone}
                    onChange={(e) => patchSection('contact', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Email público</label>
                  <input
                    type="email"
                    value={settings.contact.public_email}
                    onChange={(e) => patchSection('contact', 'public_email', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" className="btn">
            Guardar configuración
          </button>
          {saved && (
            <span className="text-sm font-medium text-emerald-600">Guardado correctamente</span>
          )}
        </div>
      </form>
    </div>
  );
}
