import AppSidebar from './AppSidebar';

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto p-8 lg:p-10">{children}</main>
    </div>
  );
}
