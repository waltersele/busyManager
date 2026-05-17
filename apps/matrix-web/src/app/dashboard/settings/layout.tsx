import SettingsNav from '@/components/SettingsNav';
import PageHeader from '@/components/PageHeader';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Configuración"
        description="Datos del negocio, apps, integraciones, equipo y tokens IA."
      />
      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-10">
        <SettingsNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
