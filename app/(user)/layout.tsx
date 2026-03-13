import DashboardNav from "@/components/dashboard-nav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <DashboardNav />
      {children}
    </div>
  );
}
