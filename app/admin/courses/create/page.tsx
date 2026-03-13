"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Plus, ArrowLeft, Loader2, Image as ImageIcon, Calendar, Clock, MessageCircle, Globe, AlignLeft } from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    timeslot: "",
    startDate: "",
    wpLink: "",
    gcrLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/course/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/courses");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to manifest the course");
      }
    } catch (err) {
      setError("Failed to communicate with the archives");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 md:p-12">
      
      <div className="max-w-4xl mx-auto mb-16">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-6 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-foreground tracking-tighter"
        >
          Manifest <span className="text-accent">Wisdom</span>
        </motion.h1>
        <p className="text-foreground/40 font-medium mt-2">Initialize a new path for seekers to follow.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 p-10 md:p-16 rounded-[4rem] shadow-2xl border border-zinc-100 dark:border-zinc-800"
      >
        <form onSubmit={handleSubmit} className="space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Core Identity */}
            <div className="space-y-8">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-accent" /> Core Identity
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Path Title</Label>
                        <div className="relative">
                            <AlignLeft className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                            <Input name="title" value={form.title} onChange={handleChange} className="h-14 pl-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold" placeholder="Bhagavad Gita Intensive" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Thumbnail URL</Label>
                        <div className="relative">
                            <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                            <Input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="h-14 pl-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold" placeholder="https://images.unsplash.com/..." required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Deep Description</Label>
                        <div className="relative">
                            <textarea name="description" value={form.description} onChange={handleChange} className="w-full min-h-[160px] p-6 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-[1.5rem] font-bold text-sm focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all" placeholder="The eternal secrets of the soul..." required />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Spacetime & Connectivity */}
            <div className="space-y-8">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-accent" /> Spacetime & Connectivity
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
                            <Input name="timeslot" value={form.timeslot} onChange={handleChange} className="h-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold px-6" placeholder="Daily 5 PM" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">WhatsApp Community</Label>
                        <div className="relative">
                            <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                            <Input name="wpLink" value={form.wpLink} onChange={handleChange} className="h-14 pl-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold" placeholder="https://chat.whatsapp.com/..." required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Classroom Nexus (GCR)</Label>
                        <div className="relative">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                            <Input name="gcrLink" value={form.gcrLink} onChange={handleChange} className="h-14 pl-14 bg-zinc-50 dark:bg-zinc-950 border-transparent rounded-2xl font-bold" placeholder="https://classroom.google.com/..." required />
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
                {loading ? <Loader2 className="animate-spin w-8 h-8" /> : <><Plus className="w-8 h-8" /> Manifest Path</>}
            </Button>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-20 italic">By clicking you manifest this knowledge into the physical realm.</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

