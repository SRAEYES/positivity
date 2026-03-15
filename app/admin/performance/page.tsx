"use client";

import { useState, useEffect } from "react";
import { BarChart3, Users, Award, TrendingUp, Search, ArrowLeft, Loader2, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AdminPerformance() {
    const [stats, setStats] = useState<any>(null);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/exams/results"); // Need to create this endpoint
                const data = await res.json();
                setStats(data.stats);
                setResults(data.results);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const filtered = (results || []).filter(r => 
        r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.quiz?.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <button onClick={() => window.location.href = '/admin/dashboard'} className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-6 hover:text-accent transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Return to Insight
                        </button>
                        <h1 className="text-5xl font-black text-foreground tracking-tighter">Wisdom <span className="text-primary italic">Analysis</span></h1>
                        <p className="text-foreground/40 font-medium mt-2">Observe the intellectual growth of thy seekers.</p>
                    </div>
                    
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                        <input 
                            placeholder="Find seeker or quest..."
                            className="h-14 w-full bg-white dark:bg-zinc-900 rounded-2xl pl-16 pr-6 font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary border-transparent"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-40 flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Distilling Insights...</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <SummaryCard label="Total Attempts" value={stats?.totalAttempts || 0} icon={<PlayCircle />} />
                            <SummaryCard label="Avg. Accuracy" value={`${stats?.avgScore || 0}%`} icon={<TrendingUp />} />
                            <SummaryCard label="Active Seekers" value={stats?.activeUsers || 0} icon={<Users />} />
                            <SummaryCard label="Perfect Scores" value={stats?.perfectScores || 0} icon={<Award />} />
                        </div>

                        {/* Results Table */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest opacity-30">Seeker</th>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest opacity-30">Wisdom Quest</th>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest opacity-30">Score</th>
                                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest opacity-30">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((r, idx) => (
                                            <motion.tr 
                                                key={idx}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.02 }}
                                                className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                                            >
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                            <img src={r.user?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user?.name}`} alt="" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black">{r.user?.name}</p>
                                                            <p className="text-[10px] opacity-40 font-bold">{r.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <p className="font-bold">{r.quiz?.title}</p>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-black text-xl text-primary">{r.score}/{r.total}</span>
                                                        <div className="w-16 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary" style={{ width: `${(r.score/r.total)*100}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <span className="text-[10px] font-bold opacity-30">{new Date(r.createdAt).toLocaleDateString()}</span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SummaryCard({ label, value, icon }: any) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-3xl font-black tracking-tighter">{value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{label}</p>
            </div>
        </div>
    );
}
