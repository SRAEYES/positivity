"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Bell, Sparkles, MessageSquare, AlertCircle, History, Loader2, Megaphone, ArrowLeft, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ManifestUpdatePortal() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", message: "", type: "info" });
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  async function fetchBroadcasts() {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      setBroadcasts(data.notifications || []);
    } catch (e) {
      console.error("Fetch error:", e);
    }
    setFetching(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus({ type: "success", message: "Update manifested successfully!" });
        setForm({ title: "", message: "", type: "info" });
        fetchBroadcasts();
      } else {
        setStatus({ type: "error", message: "Failed to broadcast update." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Communication failure with the archives." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 md:p-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-16">
        <div>
            <button 
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-6 hover:text-accent transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Return to Insight
            </button>
            <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-black text-foreground tracking-tighter"
            >
                Manifest <span className="text-accent">Update</span>
            </motion.h1>
            <p className="text-foreground/40 font-medium mt-2">Broadcast sacred news to the assembly of seekers.</p>
        </div>
        <button 
          onClick={() => router.push("/logout")}
          className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Finalize Session
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Composition Form */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-zinc-100 dark:border-zinc-800"
        >
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 mb-10">
                <Megaphone className="w-6 h-6 text-accent" /> Compose Wisdom
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Update Title</label>
                    <input 
                        type="text" 
                        value={form.title}
                        onChange={(e) => setForm({...form, title: e.target.value})}
                        placeholder="Subject of illumination..."
                        className="w-full h-16 bg-zinc-50 dark:bg-zinc-800/50 border-transparent rounded-2xl px-6 font-bold text-sm focus:ring-4 focus:ring-accent/10 transition-all outline-none"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Message Content</label>
                    <textarea 
                        value={form.message}
                        onChange={(e) => setForm({...form, message: e.target.value})}
                        placeholder="Share the sacred word..."
                        className="w-full h-40 bg-zinc-50 dark:bg-zinc-800/50 border-transparent rounded-[2rem] p-6 font-bold text-sm focus:ring-4 focus:ring-accent/10 transition-all outline-none resize-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <TypeSelector active={form.type === 'info'} onClick={() => setForm({...form, type: 'info'})} label="Info" icon={<Bell size={16}/>} color="var(--accent)" />
                    <TypeSelector active={form.type === 'wisdom'} onClick={() => setForm({...form, type: 'wisdom'})} label="Wisdom" icon={<Sparkles size={16}/>} color="#F4C430" />
                    <TypeSelector active={form.type === 'alert'} onClick={() => setForm({...form, type: 'alert'})} label="Alert" icon={<AlertCircle size={16}/>} color="#FF66CC" />
                </div>

                <AnimatePresence>
                    {status.message && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`p-4 rounded-xl text-center font-black text-xs uppercase tracking-widest ${status.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}
                        >
                            {status.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button 
                    disabled={loading}
                    type="submit"
                    className="w-full h-16 bg-accent text-white rounded-2xl font-black shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Manifest Broadcast <Send className="w-5 h-5" /></>}
                </button>
            </form>
        </motion.div>

        {/* Broadcast History */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 px-4">
                <History className="w-6 h-6 text-foreground/20" /> Past Manifestations
            </h3>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-4 scrollbar-hide">
                {fetching ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin opacity-20" /></div>
                ) : broadcasts.length === 0 ? (
                    <p className="text-center py-20 opacity-30 italic font-medium text-sm">No updates have been manifested yet.</p>
                ) : broadcasts.map((b) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={b.id}
                        className="bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${b.type === 'wisdom' ? 'bg-orange-100 text-[#FF9933]' : b.type === 'alert' ? 'bg-pink-100 text-[#FF66CC]' : 'bg-indigo-100 text-accent'}`}>
                                    {b.type === 'wisdom' ? <Sparkles size={14}/> : b.type === 'alert' ? <AlertCircle size={14}/> : <Bell size={14}/>}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{b.type}</span>
                            </div>
                            <span className="text-[10px] font-medium opacity-20">{new Date(b.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-black text-foreground mb-1">{b.title}</h4>
                        <p className="text-xs font-medium text-foreground/60 leading-relaxed">{b.message}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
      </div>
    </div>
  );
}

function TypeSelector({ active, onClick, label, icon, color }: any) {
    return (
        <button 
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${active ? 'bg-white shadow-xl shadow-black/5' : 'border-transparent opacity-40 grayscale'}`}
            style={{ borderColor: active ? color : 'transparent' }}
        >
            <div style={{ color: color }}>{icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </button>
    );
}
