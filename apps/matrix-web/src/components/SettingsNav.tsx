'use client';

import {
  IconIntegrations,
  IconSettings,
  IconStore,
  IconTeam,
  IconTokens,
} from '@/components/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/dashboard/settings/business', label: 'Negocio', Icon: IconSettings },
  { href: '/dashboard/settings/apps', label: 'Apps', Icon: IconStore },
  { href: '/dashboard/settings/integrations', label: 'Integraciones', Icon: IconIntegrations },
  { href: '/dashboard/settings/team', label: 'Equipo', Icon: IconTeam },
  { href: '/dashboard/settings/tokens', label: 'Tokens IA', Icon: IconTokens },
] as const;

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="w-52 shrink-0 space-y-1">
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
              active
                ? 'bg-orange-50 font-medium text-orange-700 shadow-sm'
                : 'text-slate-600 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Icon className={active ? 'text-orange-600' : 'text-slate-400'} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
