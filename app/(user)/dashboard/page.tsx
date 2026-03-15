"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, GraduationCap, Sparkles, Sun, Star, ArrowRight,
  Flame, Gamepad2, UserCircle2, Loader2,
  Calendar as CalendarIcon, Phone, Mail, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PerformanceSanctuary from "@/components/dashboard/PerformanceSanctuary";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [loadingTeacher, setLoadingTeacher] = useState(true);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

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
        updateStreak(parsedUser.id);
        fetchTeacher();
      }
    }
  }, [router]);

  const updateStreak = async (userId: number) => {
    try {
      await fetch("/api/user/streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
    } catch (e) { console.error(e); }
  };

  const fetchTeacher = async () => {
    try {
      const res = await fetch("/api/admin/teacher");
      const data = await res.json();
      if (data) setTeacher(data);
    } catch (e) { console.error(e); }
    finally { setLoadingTeacher(false); }
  };

  if (!checked || !loggedIn) return null;

  return (
    <div className="min-h-screen pb-10 bg-white font-sans text-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 pt-28 space-y-12">

        {/* Header Section: Integrated & Compact */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-100 pb-10">
          <div className="space-y-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter"
            >
              Namaste, <span className="text-primary italic">{user.name?.split(' ')[0]}</span>
            </motion.h1>
            <div className="flex items-center gap-4 text-zinc-400 font-black uppercase tracking-widest text-[10px]">
              <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-500" /> {user.streakCount || 1} Day Streak</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200" />
              <Link href="/dashboard/calendar" className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-500" /> Vedic Calendar
              </Link>
            </div>
          </div>

          {/* Profile options removed from here to clean up UI as requested */}
        </div>

        {/* Global Nav Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Spiritual Arena Card */}
          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => router.push("/dashboard/arena")}
            className="bg-primary/10 rounded-[3rem] p-10 shadow-sm border border-primary/5 cursor-pointer group relative overflow-hidden"
          >
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">Spiritual Arena</h3>
                <p className="text-xs font-bold text-zinc-400">Play & Learn Wisdom</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Enter Zone <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Performance Sanctuary Card */}
          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => setShowPerformanceModal(true)}
            className="bg-zinc-50 rounded-[3rem] p-10 border border-zinc-100 shadow-sm cursor-pointer group"
          >
            <div className="space-y-4 text-center sm:text-left">
              <div className="mx-auto sm:mx-0 w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">Performance</h3>
                <p className="text-xs font-bold text-zinc-400">Measured Wisdom</p>
              </div>
              <div className="pt-4 text-center sm:text-left">
                  <span className="text-3xl font-black text-secondary">85%</span>
                  <p className="text-[10px] font-black uppercase text-zinc-300 tracking-widest mt-1">Overall Rank: Initiate</p>
              </div>
            </div>
          </motion.div>

          {/* Sadhana Nexus */}
          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => router.push("/dashboard/sadhana")}
            className="bg-zinc-50 rounded-[3rem] p-10 border border-zinc-100 shadow-sm cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">Sadhana</h3>
                <p className="text-xs font-bold text-zinc-400">Daily Discipline</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                Open Journal <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Wisdom Paths */}
          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => router.push("/dashboard/enrolled")}
            className="bg-zinc-50 rounded-[3rem] p-10 border border-zinc-100 shadow-sm cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">Wisdom Paths</h3>
                <p className="text-xs font-bold text-zinc-400">Your Learning</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                View Courses <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Explore Card - Wide */}
        <motion.div 
            whileHover={{ scale: 1.01 }}
            onClick={() => router.push("/courses")}
            className="w-full bg-primary/5 p-10 md:p-14 rounded-[4rem] text-zinc-900 flex flex-col md:flex-row items-center justify-between gap-10 cursor-pointer shadow-sm border border-primary/10 group"
        >
            <div className="space-y-6 text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Seek New <span className="text-primary italic">Wisdom Paths</span></h2>
                <p className="text-lg text-zinc-500 font-medium max-w-xl italic">Explore our curated courses designed to illuminate your spiritual journey and expand thy soul.</p>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                    <div className="h-14 px-10 bg-primary text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-xs group-hover:bg-primary/90 transition-colors shadow-lg">Browse Courses</div>
                </div>
            </div>
            <div className="w-32 h-32 md:w-48 md:h-48 bg-primary rounded-[3rem] flex items-center justify-center group-hover:rotate-6 transition-transform shadow-2xl">
                <GraduationCap className="w-20 h-20 md:w-24 md:h-24 text-white" />
            </div>
        </motion.div>

        {/* Master Insight - Bottom Section */}
        <div className="bg-zinc-50 rounded-[4rem] p-10 md:p-14 border border-zinc-100 shadow-sm flex flex-col lg:flex-row items-center gap-14">
          <div className="w-56 h-56 shrink-0 rounded-[3rem] overflow-hidden border-[6px] border-white shadow-xl relative group">
            <img src={teacher?.imageUrl || "https://wallpaperaccess.com/prabhupada"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>

          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-tighter text-zinc-900">{teacher?.name || "Acharya Shrivatsa"}</h2>
              <p className="text-primary italic text-lg font-bold">Master <span className="italic">Insight</span></p>
              <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start pt-2">
                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">{teacher?.qualifications || "Spiritual Guide"}</span>
                <span className="px-4 py-1.5 bg-zinc-100 text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-widest">{teacher?.experience || "Thy Light in the Darkness"}</span>
              </div>
            </div>

            <p className="text-lg font-medium text-zinc-500 italic leading-relaxed">
              "{teacher?.bio || "Knowledge is that which liberates."}"
            </p>

            <div className="pt-6 border-t border-zinc-200 flex flex-wrap items-center gap-8 justify-center lg:justify-start text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer">
                    <Phone className="w-3.5 h-3.5 text-primary" /> {teacher?.phone || "+91 999 999 9999"}
                </div>
                <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {teacher?.email || "contact@dharmaveda.com"}
                </div>
            </div>
          </div>
        </div>

        {/* Global Footer: Compact */}
        <footer className="pt-10 border-t border-zinc-100 text-center space-y-2">
             <div className="flex items-center justify-center gap-2">
                 <Sparkles className="w-3 h-3 text-primary" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Dharma Veda Portal</p>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400">Developed by <span className="text-primary font-bold">{user.name}</span> • All Rights Reserved © {new Date().getFullYear()}</p>
        </footer>

      </div>

      {/* Performance Sanctuary Modal: Fixed Overlap */}
      <AnimatePresence>
        {showPerformanceModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPerformanceModal(false)}
              className="absolute inset-0 bg-white/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)] border border-zinc-100"
            >
              <button 
                onClick={() => setShowPerformanceModal(false)}
                className="absolute top-6 right-6 z-[100] w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-900 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="max-h-[90vh] overflow-y-auto overflow-x-hidden p-2 sm:p-6">
                 <PerformanceSanctuary userId={user.id} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}