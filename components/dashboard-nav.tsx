"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, BookOpen, GraduationCap, User, LogOut, ChevronLeft, Sun, Bell } from "lucide-react";
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
    { href: "/dashboard/notifications", label: "Updates", icon: Bell, badge: unreadCount > 0 },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

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
        <div className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar">
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
                {link.badge && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse"></span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 border-2 border-orange-300 dark:border-orange-900 rounded-2xl pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
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