"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, GraduationCap, User, LogOut, ChevronLeft, Sun, Bell, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isDeepPage = pathname.split("/").length > 3 || pathname.includes("/courses/") || pathname.includes("/edit/");

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) return;
    const user = JSON.parse(userString);

    async function fetchUnread() {
        try {
            const res = await fetch(`/api/notifications/unread-count?userId=${user.id}`);
            const data = await res.json();
            setUnreadCount(data.unreadCount || 0);
        } catch (e) { console.error(e); }
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/enrolled", label: "My Courses", icon: GraduationCap },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showUpdates, setShowUpdates] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) return;
    const user = JSON.parse(userString);
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setShowUpdates(false);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setShowUpdates(false);
    }
    if (!showUpdates) return;

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showUpdates]);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'PATCH' });
      fetchNotifications();
    } catch (e) { console.error(e); }
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-3 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-orange-200 dark:border-orange-900/40 shadow-xl shadow-orange-100/30 p-2 sm:p-3 rounded-3xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        
        <div className="flex items-center justify-between md:justify-start gap-4 sm:gap-6">
          {/* Logo / Brand */}
          <Link href="/dashboard" className="flex items-center gap-2 group ml-2">
            <div className="w-8 h-8 bg-orange-500 shadow-orange-400/40 shadow-lg rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
              <Sun className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tighter text-orange-600 dark:text-orange-400 hidden md:block">
              DharmaVeda
            </span>
          </Link>

          {isDeepPage && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900 rounded-2xl text-sm font-bold text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 shadow-orange-200/30 shadow transition-all hover:translate-x-[-2px]"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {/* Logout (mobile: top row right) */}
          <button 
            onClick={() => router.push("/logout")}
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-bold border border-orange-300 dark:border-orange-900 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 shadow-orange-200/30 shadow transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-start gap-1 md:gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href + "/"));
            const Icon = link.icon;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                  isActive 
                    ? "text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 shadow-orange-200/30 shadow border border-orange-300 dark:border-orange-900" 
                    : "text-zinc-500 dark:text-zinc-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-orange-600 dark:text-orange-400" : "opacity-60"}`} />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}

          {/* Updates (opens modal overlay) */}
          <div className="relative">
            <button 
              onClick={() => setShowUpdates(!showUpdates)}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                showUpdates 
                  ? "text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              }`}
            >
              <Bell className={`w-4 h-4 ${unreadCount > 0 ? "text-orange-600 animate-pulse" : "opacity-60"}`} />
              <span className="hidden sm:inline">Updates</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
              )}
            </button>
          </div>
        </div>

        {/* Logout (desktop) */}
        <button 
          onClick={() => router.push("/logout")}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold border border-orange-300 dark:border-orange-900 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 shadow-orange-200/30 shadow ml-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
        </div>
      </div>

      {/* Updates Modal Overlay */}
      {showUpdates && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6"
          aria-modal="true"
          role="dialog"
        >
          <button
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Close updates"
            onClick={() => setShowUpdates(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            ref={modalRef}
            className="relative w-full max-w-md mt-16 sm:mt-20 bg-white dark:bg-zinc-900 border border-orange-100 dark:border-orange-900 rounded-[2rem] shadow-3xl p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest text-orange-600">Divine Updates</h3>
                <p className="text-[11px] font-semibold opacity-50 mt-1">{unreadCount} unread</p>
              </div>
              <button
                onClick={() => setShowUpdates(false)}
                className="p-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition"
                aria-label="Close"
              >
                <X className="w-4 h-4 opacity-70" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center py-10 text-xs font-medium opacity-40 italic">No new revelations today...</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      n.read
                        ? "bg-zinc-50 dark:bg-zinc-800/50 border-transparent opacity-60"
                        : "bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-black text-xs">{n.title}</h4>
                      {!n.read && <span className="mt-1 w-2 h-2 bg-orange-500 rounded-full flex-none" />}
                    </div>
                    <p className="text-[10px] font-medium opacity-60 line-clamp-3 mt-1">{n.message}</p>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </nav>
  );
}