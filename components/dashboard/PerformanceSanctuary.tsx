"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, Target, Award, Loader2, Star, Sparkles, ChevronRight, BarChart3 } from "lucide-react";

export default function PerformanceSanctuary({ userId }: { userId: number }) {
  const [results, setResults] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"stats" | "leaderboard">("stats");

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const [res, lbRes] = await Promise.all([
            fetch(`/api/user/performance?userId=${userId}`), // Note: Need to implement userId filter in API or another route
            fetch('/api/user/performance')
        ]);
        const data = await res.json();
        const lbData = await lbRes.json();
        setResults(Array.isArray(data) ? data : []);
        setLeaderboard(Array.isArray(lbData) ? lbData : []);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    if (userId) fetchPerformance();
  }, [userId]);

  const avgScore = results.length > 0 
    ? Math.round((results.reduce((acc, curr) => acc + (curr.score/curr.total), 0) / results.length) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-[4rem] p-10 md:p-16 border border-zinc-100 shadow-xl space-y-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Trophy className="w-64 h-64 rotate-12" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
            <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tighter">Performance <span className="text-primary italic">Sanctuary</span></h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Thy Path of Wisdom Measured</p>
            </div>

            <div className="flex bg-zinc-50 dark:bg-zinc-800 p-2 rounded-2xl">
                {(["stats", "leaderboard"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-primary text-white shadow-lg" : "text-foreground/40 hover:text-foreground"}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        <AnimatePresence mode="wait">
            {activeTab === "stats" ? (
                <motion.div 
                    key="stats"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    <StatBox 
                        icon={<Star className="w-6 h-6" />} 
                        label="Average Accuracy" 
                        value={`${avgScore}%`} 
                        color="text-primary" 
                        bgColor="bg-primary/10"
                    />
                    <StatBox 
                        icon={<Target className="w-6 h-6" />} 
                        label="Wisdom Quests" 
                        value={results.length.toString()} 
                        color="text-secondary" 
                        bgColor="bg-secondary/10"
                    />
                    <StatBox 
                        icon={<Award className="w-6 h-6" />} 
                        label="Spirit Ranking" 
                        value="Initiate" 
                        color="text-emerald-500" 
                        bgColor="bg-emerald-500/10"
                    />

                    <div className="col-span-full bg-zinc-50 dark:bg-zinc-800/50 p-10 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center gap-4 mb-8">
                            <TrendingUp className="w-6 h-6 text-primary" />
                            <h4 className="font-black text-xl tracking-tight">Wisdom Trajectory</h4>
                        </div>
                        
                        {results.length > 0 ? (
                            <div className="space-y-6">
                                {results.slice(0, 5).map((res, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm">
                                        <div>
                                            <p className="font-black text-sm">{res.quiz?.title || "Divine Quiz"}</p>
                                            <p className="text-[10px] uppercase font-bold opacity-30 mt-1">{new Date(res.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-xl text-primary">{res.score}/{res.total}</p>
                                            <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary" 
                                                    style={{ width: `${(res.score/res.total)*100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center space-y-4 opacity-30">
                                <Sparkles className="w-12 h-12 mx-auto" />
                                <p className="font-black uppercase tracking-widest text-[10px]">Thy records are yet to be etched in time.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="leaderboard"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    {leaderboard.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 group hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${idx < 3 ? 'bg-primary text-white shadow-lg' : 'bg-zinc-200 dark:bg-zinc-700 text-foreground/40'}`}>
                                    {idx + 1}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                                        <img src={entry.user?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.user?.name}`} alt="" />
                                    </div>
                                    <div>
                                        <p className="font-black text-lg">{entry.user?.name || "Seeker"}</p>
                                        <p className="text-[10px] font-black uppercase text-primary tracking-widest">Level 2 Seeker</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-foreground">{entry.totalScore || entry.score}</p>
                                <p className="text-[10px] font-black uppercase opacity-30 tracking-widest">Sacred Points</p>
                            </div>
                        </div>
                    ))}
                    {leaderboard.length === 0 && (
                        <div className="py-20 text-center space-y-4 opacity-20">
                             <BarChart3 className="w-16 h-16 mx-auto" />
                             <p className="text-xl font-black italic">The Sangha is in deep contemplation...</p>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}

function StatBox({ icon, label, value, color, bgColor }: any) {
    return (
        <div className="bg-zinc-50 dark:bg-zinc-800/30 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center space-y-4">
            <div className={`w-14 h-14 ${bgColor} ${color} rounded-2xl flex items-center justify-center`}>
                {icon}
            </div>
            <div>
                <p className={`text-4xl font-black ${color} tracking-tighter`}>{value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{label}</p>
            </div>
        </div>
    );
}
