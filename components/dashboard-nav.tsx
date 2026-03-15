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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUpdates(false);
      }
    }
    if (showUpdates) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUpdates]);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'PATCH' });
      fetchNotifications();
    } catch (e) { console.error(e); }
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-orange-200 dark:border-orange-900/40 shadow-xl shadow-orange-100/30 p-3 rounded-3xl">
        
        <div className="flex items-center gap-6">
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
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900 rounded-2xl text-sm font-bold text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 shadow-orange-200/30 shadow transition-all hover:translate-x-[-2px]"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 md:gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href + "/"));
            const Icon = link.icon;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
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

          {/* Updates Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowUpdates(!showUpdates)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
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

            {showUpdates && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-4 w-80 bg-white dark:bg-zinc-900 border border-orange-100 dark:border-orange-900 rounded-[2rem] shadow-3xl p-6 z-[60]"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-sm uppercase tracking-widest text-orange-600">Divine Updates</h3>
                  <span className="text-[10px] font-bold opacity-30">{unreadCount} New</span>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-center py-8 text-xs font-medium opacity-40 italic">No new revelations today...</p>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => markAsRead(n.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          n.read 
                            ? "bg-zinc-50 dark:bg-zinc-800/50 border-transparent opacity-60" 
                            : "bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/40"
                        }`}
                      >
                        <h4 className="font-black text-xs mb-1">{n.title}</h4>
                        <p className="text-[10px] font-medium opacity-60 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={() => router.push("/logout")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold border border-orange-300 dark:border-orange-900 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 shadow-orange-200/30 shadow ml-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}