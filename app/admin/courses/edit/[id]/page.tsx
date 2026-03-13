"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Save, ArrowLeft, Loader2, Image as ImageIcon, Calendar, Clock, MessageCircle, Globe, AlignLeft, History } from "lucide-react";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    timeslot: "",
    wpLink: "",
    gcrLink: "",
    startDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/admin/course/edit/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            title: data.title || "",
            description: data.description || "",
            thumbnail: data.thumbnail || "",
            timeslot: data.timeslot || "",
            wpLink: data.wpLink || "",
            gcrLink: data.gcrLink || "",
            startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch course", err);
      }
      setFetching(false);
    }
    if (courseId) fetchCourse();
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/course/edit/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/courses");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update the sacred record");
      }
    } catch (err) {
      setError("Communication failure with the archives");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Retrieving Wisdom...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 md:p-12">
      
      <div className="max-w-4xl mx-auto mb-16">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-6 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Discard Changes
        </button>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-foreground tracking-tighter"
        >
          Refine <span className="text-accent">Knowledge</span>
        </motion.h1>
        <div className="flex items-center gap-3 mt-2">
            <History className="w-4 h-4 text-accent opacity-40 shrink-0" />
            <p className="text-foreground/40 font-medium">Modifying record ID: <span className="font-black text-accent">{courseId}</span></p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 p-10 md:p-16 rounded-[4rem] shadow-2xl border border-zinc-100 dark:border-zinc-800"
      >
        <form onSubmit={handleSubmit} className="space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-8">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-accent" /> Essential Information
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Path Title</Label>
                        <div className="relative">
                            <AlignLeft className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                            <Input name="title" value={form.title} onChange={handleChange} className="h-14 pl-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Thumbnail URL</Label>
                        <div className="relative">
                            <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                            <Input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="h-14 pl-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Archive Description</Label>
                        <div className="relative">
                            <textarea name="description" value={form.description} onChange={handleChange} className="w-full min-h-[160px] p-6 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-[1.5rem] font-bold text-sm focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all" required />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-accent" /> Logistics & Access
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Start Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                                <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="h-14 pl-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Timeslot</Label>
                            <Input name="timeslot" value={form.timeslot} onChange={handleChange} className="h-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold px-6" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">WhatsApp Community Link</Label>
                        <div className="relative">
                            <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                            <Input name="wpLink" value={form.wpLink} onChange={handleChange} className="h-14 pl-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Classroom Nexus (GCR)</Label>
                        <div className="relative">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                            <Input name="gcrLink" value={form.gcrLink} onChange={handleChange} className="h-14 pl-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold" required />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="pt-12 border-t border-zinc-100 dark:border-zinc-800 flex flex-col items-center">
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full mb-8 p-4 bg-destructive/5 text-destructive text-center rounded-2xl font-bold text-sm border border-destructive/10"
                >
                    {error}
                </motion.div>
            )}
            <Button 
                type="submit" 
                disabled={loading} 
                className="w-full md:w-auto px-20 h-20 bg-accent hover:bg-accent/90 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-accent/20 transition-all active:scale-[0.98] gap-4"
            >
                {loading ? <Loader2 className="animate-spin w-8 h-8" /> : <><Save className="w-8 h-8" /> Seal Changes</>}
            </Button>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-20 italic">Updating the archives will propagate changes instantly.</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}