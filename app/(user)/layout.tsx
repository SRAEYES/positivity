import DashboardNav from "@/components/dashboard-nav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-x-hidden">
      {/* Background elements for spiritual consistency */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07] z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
      </div>
      
      <DashboardNav />
      
      <main className="flex-1 relative z-10 min-w-0">
        {children}
      </main>
    </div>
  );
}

