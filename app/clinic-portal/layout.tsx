import ClinicPortalSidebar from '@/components/clinic-portal/ClinicPortalSidebar';

export default function ClinicPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-stone-50">
      <ClinicPortalSidebar />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
