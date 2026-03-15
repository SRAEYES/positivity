"use client";

import { useState, useEffect } from "react";
import { GraduationCap, ArrowLeft, Loader2, Search, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AdminEnrollments() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const res = await fetch("/api/admin/analytics"); // Using existing analytics endpoint which has enrollment data
            const data = await res.json();
            // Assuming the analytics endpoint or a new one returns list. 
            // Better to create a dedicated one if needed. Let's check if we have one.
            setEnrollments(data.recentEnrollments || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const filtered = enrollments.filter(e => 
        e.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.course?.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <button 
                            onClick={() => window.location.href = '/admin/dashboard'}
                            className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-6 hover:text-accent transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Return to Insight
                        </button>
                        <h1 className="text-5xl font-black text-foreground tracking-tighter">Wisdom <span className="text-secondary italic">Initiations</span></h1>
                        <p className="text-foreground/40 font-medium mt-2">Track the journey of seekers across the paths.</p>
                    </div>
                    
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                        <input 
                            placeholder="Search seeker or path..."
                            className="h-14 w-full bg-white dark:bg-zinc-900 rounded-2xl pl-16 pr-6 font-bold shadow-sm border-transparent focus:ring-2 focus:ring-secondary outline-none"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
                        <p className="text-foreground/40 font-black uppercase tracking-widest text-[10px]">Consulting the Akasha...</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest opacity-30 text-secondary">Seeker</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest opacity-30 text-secondary">Wisdom Path</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest opacity-30 text-secondary">Initiation Date</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest opacity-30 text-secondary">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length > 0 ? filtered.map((e, idx) => (
                                        <motion.tr 
                                            key={e.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg">{e.user?.name}</p>
                                                        <p className="text-xs text-foreground/40 font-bold">{e.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div>
                                                    <p className="font-black text-lg">{e.course?.title}</p>
                                                    <p className="text-xs text-secondary font-black uppercase tracking-tighter">Divine Offering</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2 text-foreground/40 font-bold text-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(e.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="px-4 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">Active Path</span>
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-12 text-center text-foreground/40 font-bold italic">No seekers found in this realm.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
