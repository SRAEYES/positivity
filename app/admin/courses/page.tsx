"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Edit3, Trash2, Search, ArrowLeft, Loader2, Sparkles, Filter, MoreVertical, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCourses() {
    setLoading(true);
    try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data.courses || []);
    } catch (e) {
        console.error("Fetch error:", e);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  async function deleteCourse(id: number) {
    if (!confirm("Are you certain you wish to dissolve this path of wisdom?")) return;
    const res = await fetch(`/api/admin/course/delete?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchCourses();
    } else {
        alert("Failed to delete the course.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 md:p-12">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <button 
            onClick={() => window.location.href = '/admin/dashboard'}
            className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-6 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Insight
          </button>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-foreground tracking-tighter"
          >
            Wisdom <span className="text-accent">Archives</span>
          </motion.h1>
          <p className="text-foreground/40 font-medium mt-2">Curate and manage the sacred syllabus.</p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
        >
            <button 
                onClick={() => window.location.href = "/admin/courses/create"}
                className="flex items-center gap-3 px-8 h-14 bg-accent text-white rounded-2xl font-black shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                <Plus className="w-5 h-5" /> Manifest New Path
            </button>
            <button 
                onClick={() => window.location.href = '/logout'}
                className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors"
                title="Depart Portal"
            >
                <LogOut className="w-4 h-4" /> Logout Session
            </button>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-center">
            <div className="relative flex-1 group w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-accent transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search the archives..." 
                    className="w-full h-16 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] pl-16 pr-6 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all shadow-xl shadow-black/5"
                />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 h-16 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] opacity-40 hover:opacity-100 transition-all">
                    <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 h-16 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] opacity-40 hover:opacity-100 transition-all">
                    <MoreVertical className="w-4 h-4" /> Actions
                </button>
            </div>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Consulting Scribes...</p>
            </div>
        ) : (
            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {courses.map((course: any, idx) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-8 hover:shadow-2xl hover:shadow-accent/5 hover:border-accent/10 transition-all"
                        >
                            <div className="flex items-center gap-8 flex-1">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] overflow-hidden bg-accent/5 flex items-center justify-center shrink-0 border border-accent/10">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    ) : (
                                        <BookOpen className="w-10 h-10 text-accent opacity-20" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[8px] font-black uppercase tracking-widest">Active</span>
                                        <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight group-hover:text-accent transition-colors">{course.title}</h2>
                                    </div>
                                    <p className="text-foreground/40 text-sm font-medium line-clamp-1 max-w-md italic">{course.description || "Divine knowledge awaiting formal description."}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden lg:block px-8 py-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl text-center">
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">Initiates</p>
                                    <p className="text-sm font-black text-foreground">124 Seeker</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        className="h-14 px-6 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl text-foreground font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white hover:border-accent transition-all flex items-center gap-2"
                                        onClick={() => window.location.href = `/admin/courses/edit/${course.id}`}
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => deleteCourse(course.id)}
                                        className="h-14 px-6 bg-destructive/5 text-destructive border border-destructive/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-destructive hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Dissolve
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-6xl mx-auto mt-20 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 flex items-center justify-center gap-4">
            <Sparkles className="w-3 h-3" /> DharmaVeda Administrative Unit <Sparkles className="w-3 h-3" />
        </p>
      </div>
    </div>
  );
}