import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-stone-50">
        <AdminSidebar />
        <main className="flex-1 md:ml-64 overflow-auto">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
