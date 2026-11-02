import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "لوحة التحكم الإدارية | Seen Hijabi Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col lg:flex-row w-full" suppressHydrationWarning>
      {/* Responsive Navigation (Desktop Sidebar + Mobile Top Bar & Drawer) */}
      <AdminSidebar />

      {/* Main Admin Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto min-w-0" suppressHydrationWarning>
        {children}
      </main>
    </div>
  );
}
