"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Calendar, MessageCircle, ExternalLink, XCircle, Sparkles, Loader2, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function EnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchEnrollments() {
    setLoading(true);
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
    if (user.id) {
      try {
        const res = await fetch(`/api/enrollments?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data.enrollments || []);
        }
      } catch (e) {
        console.error("Enrollments fetch error:", e);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEnrollments();
  }, []);

  async function handleUnenroll(courseId: number) {
    if (!confirm("Are you sure you want to drop this path of wisdom?")) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const res = await fetch("/api/enroll", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, courseId })
      });
      if (res.ok) {
        fetchEnrollments();
      } else {
        alert("Failed to de-enroll.");
      }
    } catch {
      alert("Error processing your request.");
    }
  }

  return (
    <div className="min-h-screen pb-20">
      
      {/* Personalized Header */}
      <div className="relative pt-20 pb-20 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent z-0"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase tracking-[0.2em] mb-6">
            <GraduationCap className="w-3.5 h-3.5" />
            Your Sanctuary
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter mb-6 italic">
            Your Inner <span className="text-secondary italic">Journey</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-medium leading-relaxed">
            "Practice is the path to liberation." Access your sacred knowledge and continue your spiritual evolution.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-secondary animate-spin" />
            <p className="text-foreground/40 font-black uppercase tracking-widest text-sm">Reviewing your progress...</p>
          </div>
        ) : courses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-xl rounded-[4rem] border border-dashed border-secondary/20 text-center"
          >
            <div className="w-20 h-20 bg-secondary/10 rounded-3xl mb-6 flex items-center justify-center">
               <GraduationCap className="w-10 h-10 text-secondary opacity-30" />
            </div>
            <p className="text-2xl font-black text-foreground/50 italic mb-8">
              No paths of wisdom are currently being walked.
            </p>
            <a href="/courses" className="flex items-center gap-3 px-10 py-5 bg-secondary text-white rounded-[2rem] font-black shadow-xl shadow-secondary/20 hover:scale-[1.02] transition-transform">
              Begin Your Journey <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        ) : (
          <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((e: any, idx) => (
              <motion.div 
                key={e.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white/80 dark:bg-zinc-800/80 backdrop-blur-2xl p-8 rounded-[3.5rem] shadow-2xl shadow-black/[0.03] border border-white dark:border-white/5 flex flex-col h-full"
              >
                <div className="relative h-48 w-full mb-8 rounded-[2.5rem] overflow-hidden">
                  {e.course.thumbnail ? (
                    <img src={e.course.thumbnail} alt={e.course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-secondary opacity-20" />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <h2 className="text-2xl font-black text-foreground mb-4 leading-tight group-hover:text-secondary transition-colors">{e.course.title}</h2>
                  
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-40 mb-8">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>Initiated {new Date(e.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="mt-auto space-y-4">
                    {e.paid ? (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {e.course.wpLink && (
                          <a href={e.course.wpLink} target="_blank" className="flex items-center justify-center gap-2 px-4 py-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-xs font-black uppercase tracking-tighter hover:bg-secondary hover:text-white transition-all">
                            <MessageCircle className="w-4 h-4" />
                            Sangha
                          </a>
                        )}
                        {e.course.gcrLink && (
                          <a href={e.course.gcrLink} target="_blank" className="flex items-center justify-center gap-2 px-4 py-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-xs font-black uppercase tracking-tighter hover:bg-secondary hover:text-white transition-all">
                            <ExternalLink className="w-4 h-4" />
                            Classroom
                          </a>
                        )}
                      </div>
                    ) : (
                      e.course.price === 0 ? (
                        <div className="flex items-center gap-3 bg-secondary/10 text-secondary px-6 py-4 rounded-2xl mb-4 border border-secondary/20">
                          <BookOpen className="w-5 h-5" />
                          <span className="text-xs font-black uppercase tracking-widest">Divine Path Ready</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 bg-orange-100/50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-6 py-4 rounded-2xl mb-4 border border-orange-200 dark:border-orange-900/50">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                          <span className="text-xs font-black uppercase tracking-widest">Dakshina Pending</span>
                        </div>
                      )
                    )}

                    <button 
                      onClick={() => handleUnenroll(e.courseId)}
                      className="w-full h-14 flex items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-900 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 text-xs font-black uppercase tracking-widest text-foreground/40 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      Cease Journey
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}