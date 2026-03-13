"use client";

import { useEffect, useState } from "react";
import { Bell, Sparkles, AlertCircle, Loader2, Megaphone, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsSanctuary() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) return;
    const user = JSON.parse(userString);

    async function fetchNotifications() {
      try {
        const res = await fetch(`/api/notifications?userId=${user.id}`);
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (e) {
        console.error("Fetch error:", e);
      }
      setLoading(false);
    }
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      
      <div className="mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-4"
        >
          <Inbox className="w-3 h-3" /> Notifications Sanctuary
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-foreground tracking-tighter"
        >
          Sacred <span className="text-accent">Updates</span>
        </motion.h1>
        <p className="text-foreground/40 font-medium mt-2">Hear the cosmic whispers and stay informed on your journey.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Retrieving Wisdom...</p>
        </div>
      ) : notifications.length === 0 ? (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-40 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl rounded-[4rem] border border-zinc-100 dark:border-zinc-800 border-dashed"
        >
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Bell className="w-8 h-8 opacity-10" />
            </div>
            <p className="text-xl font-black text-foreground opacity-20">The silence is peaceful.</p>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-10 mt-2">No updates available at this moment.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
                {notifications.map((n, idx) => (
                    <motion.div 
                        key={n.id}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/5 group hover:border-accent/30 transition-all flex gap-6 md:gap-8 items-start"
                    >
                        <div className={`w-16 h-16 shrink-0 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                            n.type === 'wisdom' ? 'bg-[#FF9933] text-white shadow-[#FF9933]/20' : 
                            n.type === 'alert' ? 'bg-[#FF66CC] text-white shadow-[#FF66CC]/20' : 
                            'bg-accent text-white shadow-accent/20'
                        }`}>
                            {n.type === 'wisdom' ? <Sparkles size={24}/> : n.type === 'alert' ? <AlertCircle size={24}/> : <Megaphone size={24}/>}
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                     n.type === 'wisdom' ? 'text-[#FF9933]' : 
                                     n.type === 'alert' ? 'text-[#FF66CC]' : 
                                     'text-accent'
                                }`}>
                                    {n.type}
                                </span>
                                <span className="text-[10px] font-bold opacity-20">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-3 tracking-tight group-hover:text-accent transition-colors">{n.title}</h3>
                            <p className="text-sm font-medium text-foreground/60 leading-relaxed">{n.message}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      )}
    </div>
  );
}
