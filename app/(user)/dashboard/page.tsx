"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, GraduationCap, Sparkles, Sun, Star, ArrowRight,
  Heart, Zap, LayoutDashboard, Flame, Trophy, Award,
  Gamepad2, UserCircle2, ChevronRight, Loader2, ChevronLeft,
  Calendar as CalendarIcon, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import SpiritualQuiz from "@/components/games/spiritual-quiz";
import VedicPuzzles from "@/components/games/vedic-puzzles";
import DivineBowl from "@/components/games/divine-bowl";
import FlipCards from "@/components/games/flip-cards";
import DivineStack from "@/components/games/DivineStack";
import PerformanceSanctuary from "@/components/dashboard/PerformanceSanctuary";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [loadingTeacher, setLoadingTeacher] = useState(true);
  const [activeGame, setActiveGame] = useState<string | null>(null);

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

  if (!checked) return null;
  if (!loggedIn) return null;

  return (
    <div className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-20">

        {/* Divine Greeting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary w-fit shadow-lg shadow-primary/5"
            >
              <Sun className="w-4 h-4 animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sacred Awakening</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black text-foreground tracking-tighter"
            >
              Namaste, <span className="text-primary italic">{user.name?.split(' ')[0]}</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard/profile")}
            className="bg-white dark:bg-zinc-900 px-8 py-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl flex items-center gap-6 cursor-pointer hover:border-primary transition-all"
          >
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Thy Current Level</p>
              <p className="text-2xl font-black text-foreground">Initiate Seeker</p>
            </div>
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <UserCircle2 className="w-8 h-8" />
            </div>
          </motion.div>
        </div>

        {/* Motivation Wall & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Streak Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative overflow-hidden bg-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/30 group cursor-pointer"
          >
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <Flame className="w-10 h-10 text-orange-300" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Spiritual Momentum</span>
              </div>
              <div>
                <h3 className="text-7xl font-black tracking-tighter">{user.streakCount || 1}</h3>
                <p className="text-xl font-bold opacity-80">Day Discipline Streak</p>
              </div>
              <p className="text-sm font-medium opacity-60 italic">"Consistency is the key to liberation."</p>
            </div>
            <Sparkles className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform" />
          </motion.div>

          {/* Perks Info */}
          <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 shadow-2xl flex flex-col justify-between group transition-all">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black group-active:text-primary transition-colors">Unlocked Perks</h3>
                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Rewards of Consistency</p>
              </div>
              <Award className="w-10 h-10 text-secondary group-active:animate-bounce" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 text-center hover:bg-secondary hover:text-white transition-all cursor-pointer">
                <p className="text-[10px] font-black uppercase tracking-tighter">Early Access</p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center hover:bg-indigo-500 hover:text-white active:bg-indigo-700 active:scale-95 transition-all cursor-pointer group">
                <p className="text-[10px] font-black uppercase tracking-tighter">Premium Slokas</p>
              </div>
            </div>
          </div>

          {/* Spiritual Calendar Widget */}
          <Link href="/dashboard/calendar" className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 shadow-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between group transition-all hover:border-orange-200 dark:hover:border-orange-900">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black group-hover:text-primary transition-colors">Vedic Calendar</h3>
                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest line-clamp-1">Alignment with Divine Timing</p>
              </div>
              <CalendarIcon className="w-10 h-10 text-orange-500" />
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                  <span className="text-lg font-black text-orange-600">14</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black">Ekadashi</p>
                    <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Papamochani FAST</p>
                  </div>
               </div>
               <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 group-hover:translate-x-2 transition-transform">View Full Calendar <ArrowRight className="w-3 h-3" /></p>
            </div>
          </Link>
        </div>

        {/* Core Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Sadhana Nexus", desc: "Mantra & Wisdom Journal", icon: <Sun className="w-10 h-10" />, color: "text-primary", bgColor: "bg-primary/5", glowColor: "hover:shadow-primary/20", href: "/dashboard/sadhana" },
            { title: "Wisdom Paths", desc: "My Enrolled Courses", icon: <BookOpen className="w-10 h-10" />, color: "text-secondary", bgColor: "bg-secondary/5", glowColor: "hover:shadow-secondary/20", href: "/dashboard/enrolled" },
            { title: "Seek New Path", desc: "Explore Temple Courses", icon: <GraduationCap className="w-10 h-10" />, color: "text-indigo-500", bgColor: "bg-indigo-500/5", glowColor: "hover:shadow-indigo-500/20", href: "/courses" }
          ].map((action, j) => (
            <motion.div
              key={j}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(action.href)}
              className={`bg-white dark:bg-zinc-900 rounded-[4rem] p-12 flex flex-col items-center text-center space-y-8 shadow-2xl transition-all cursor-pointer group relative overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:border-transparent ${action.glowColor} hover:shadow-2xl`}
            >
              <div className={`w-24 h-24 ${action.bgColor} rounded-3xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tight uppercase text-zinc-900 dark:text-white">{action.title}</h3>
                <p className="text-sm font-medium text-foreground/40 mt-1">{action.desc}</p>
              </div>
              <div className={`w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-foreground/20 group-hover:bg-primary group-hover:text-white transition-all shadow-lg`}>
                <ArrowRight className="w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Teacher Spotlight */}
        <div className="bg-white dark:bg-zinc-900 rounded-[5rem] p-12 md:p-20 border border-zinc-200 dark:border-zinc-800 shadow-3xl flex flex-col lg:flex-row items-center gap-20 relative overflow-hidden group transition-all">
          <LayoutDashboard className="absolute -left-20 -top-20 w-80 h-80 text-foreground/5 opacity-40" />

          <div className="w-72 h-72 shrink-0 rounded-[4rem] overflow-hidden border-[12px] border-zinc-50 dark:border-zinc-800 shadow-3xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
            <img src={teacher?.imageUrl || "https://wallpaperaccess.com/prabhupada"} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-10 relative z-10 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className="text-6xl font-black tracking-tighter">Master <span className="text-secondary italic">Insight</span></h2>
              <p className="text-xs font-black uppercase tracking-[0.5em] text-foreground/20">Thy Guide in the Material World</p>
            </div>

            {loadingTeacher ? (
              <div className="flex items-center gap-4 text-secondary/40 font-black uppercase text-xs tracking-widest"><Loader2 className="animate-spin" /> Calling the Scribes...</div>
            ) : teacher ? (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-4xl font-black tracking-tight">{teacher.name}</h3>
                  <div className="flex items-center gap-4 justify-center lg:justify-start">
                    <span className="px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest">{teacher.qualifications}</span>
                    <span className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-foreground/40 rounded-full text-[10px] font-black uppercase tracking-widest">{teacher.experience}</span>
                  </div>
                </div>
                <p className="text-xl font-medium text-foreground/60 leading-relaxed max-w-2xl italic">
                  "{teacher.bio}"
                </p>
                <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                  <Button className="h-16 px-12 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-secondary/30 active:scale-95 transition-all">Ask Sacred Counsel</Button>
                  <Button variant="ghost" className="h-16 px-10 font-black text-xs uppercase tracking-widest gap-3 opacity-60 hover:opacity-100">View Divine Legacy <ArrowRight className="w-5 h-5" /></Button>
                </div>
              </div>
            ) : (
              <p className="opacity-40 italic font-bold">The master is currently in meditation...</p>
            )}
          </div>
        </div>

        {/* Performance & Leaderboard */}
        <section>
             <PerformanceSanctuary userId={user.id} />
        </section>

        {/* Spiritual Arena */}
        <div className="py-20 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 px-6">
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-black tracking-tighter">Spiritual <span className="text-primary">Arena</span></h2>
              <p className="text-foreground/40 font-black text-xs uppercase tracking-[0.3em] mt-2">Play. Learn. Transpose.</p>
            </div>
            {activeGame && (
              <Button variant="ghost" className="h-12 px-6 rounded-xl bg-zinc-100 dark:bg-zinc-800 font-black text-xs uppercase tracking-widest gap-3 hover:bg-primary hover:text-white transition-all" onClick={() => setActiveGame(null)}>
                <ChevronLeft className="w-4 h-4" /> Exit Arena
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeGame ? (
              <motion.div
                key="game-view"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {activeGame === "Vedic Quiz" && <SpiritualQuiz />}
                {activeGame === "Mantra Puzzle" && <VedicPuzzles />}
                {activeGame === "Divine Bowl" && <DivineBowl />}
                {activeGame === "Smart Learning" && <FlipCards />}
                {activeGame === "Sacred Stack" && <DivineStack />}
              </motion.div>
            ) : (
              <motion.div
                key="arena-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {[
                  { title: "Vedic Quiz", icon: <Star className="w-6 h-6" />, color: "bg-indigo-500", desc: "Test thy knowledge of Gita" },
                  { title: "Mantra Puzzle", icon: <Gamepad2 className="w-6 h-6" />, color: "bg-orange-500", desc: "Align the sacred sounds" },
                  { title: "Smart Learning", icon: <Zap className="w-6 h-6" />, color: "bg-rose-500", desc: "Sanskrit vocabulary flip" },
                  { title: "Sacred Stack", icon: <LayoutDashboard className="w-6 h-6" />, color: "bg-blue-500", desc: "Flash cards of the Gods" },
                  { title: "Divine Bowl", icon: <Sparkles className="w-6 h-6" />, color: "bg-emerald-500", desc: "Pick a blessing for today" }
                ].map((game, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGame(game.title)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-10 rounded-[4rem] shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer group relative overflow-hidden active:shadow-inner"
                  >
                    <div className={`w-16 h-16 ${game.color} rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-white/5 group-hover:scale-110 group-active:scale-95 transition-transform`}>
                      <div className="text-white">{game.icon}</div>
                    </div>
                    <h3 className="text-2xl font-black mb-3 transition-colors tracking-tight uppercase text-zinc-900 dark:text-white">{game.title}</h3>
                    <p className="text-sm text-foreground/40 font-medium italic mb-6 leading-none">{game.desc}</p>
                    <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 group-active:translate-x-2 transition-all">
                      Enter Realm <ChevronRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}