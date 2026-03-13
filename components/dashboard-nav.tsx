"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, GraduationCap, User, LogOut, ChevronLeft, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isDeepPage = pathname.split("/").length > 3 || pathname.includes("/courses/") || pathname.includes("/edit/");

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/enrolled", label: "My Courses", icon: GraduationCap },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 p-3 rounded-3xl">
        
        <div className="flex items-center gap-6">
          {/* Logo / Brand */}
          <Link href="/dashboard" className="flex items-center gap-2 group ml-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-12 transition-transform">
              <Sun className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tighter text-primary hidden md:block">
              DharmaVeda
            </span>
          </Link>

          {isDeepPage && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-sm font-bold text-foreground/70 hover:text-foreground transition-all hover:translate-x-[-2px]"
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
                    ? "text-primary bg-primary/10" 
                    : "text-foreground/60 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "opacity-60"}`} />
                <span className="hidden sm:inline">{link.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 border-2 border-primary/20 rounded-2xl pointer-events-none"
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all ml-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}