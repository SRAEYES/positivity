"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Sparkles, Sun } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        router.replace("/login");
        setChecked(true);
        setLoggedIn(false);
      } else {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setChecked(true);
        setLoggedIn(true);
      }
    }
  }, [router]);

  if (!checked || !loggedIn) return null;

  return (
    <div className="flex flex-col flex-1 min-h-screen pb-12">
      
      {/* Spiritual Greeting Header */}
      <div className="relative bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-50 dark:from-orange-950 dark:via-amber-900/40 dark:to-zinc-900 border-b border-orange-200 dark:border-orange-900/50 pt-16 pb-24 px-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-200/50 dark:bg-orange-800/30 text-orange-800 dark:text-orange-200 text-sm font-medium mb-4">
              <Sun className="w-4 h-4" />
              <span>A new day for growth</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">
              Namaste, <span className="text-orange-600 dark:text-orange-400 capitalize">{user?.name || "Seeker"}</span>.
            </h1>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-xl font-medium">
              "You have the right to work, but never to the fruit of work." 
              <span className="block mt-1 text-sm opacity-80">— Bhagavad Gita</span>
            </p>
          </div>
          
          <div className="hidden md:flex items-center justify-center p-6 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-lg">
             <Sparkles className="w-16 h-16 text-orange-500 opacity-80" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto w-full px-6 -mt-12 relative z-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Explore Courses Card */}
          <div 
            onClick={() => router.push("/courses")}
            className="group cursor-pointer bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-zinc-200 dark:border-zinc-700 flex flex-col items-start"
          >
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl mb-6 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors">
              <BookOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              Explore Wisdom
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Discover profound scriptures, ancient philosophy, and guided meditation practices. Enroll in courses to elevate your spiritual journey.
            </p>
            <div className="mt-auto font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-2">
              Browse Catalog <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* My Courses Card */}
          <div 
            onClick={() => router.push("/dashboard/enrolled")}
            className="group cursor-pointer bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-zinc-200 dark:border-zinc-700 flex flex-col items-start"
          >
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl mb-6 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
              <GraduationCap className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              My Journey
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Continue your ongoing courses. Access your classroom materials, join WhatsApp discussions, and track your inner growth.
            </p>
            <div className="mt-auto font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              Resume Learning <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}