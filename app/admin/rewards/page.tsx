"use client";

import { useState, useEffect } from "react";
import { Trophy, Plus, Gift, Trash2, Loader2, ArrowLeft, Gem } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AdminRewards() {
    const [perks, setPerks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    
    const [newPerk, setNewPerk] = useState({
        name: "",
        description: "",
        type: "gift",
        imageUrl: ""
    });

    useEffect(() => {
        fetchPerks();
    }, []);

    const fetchPerks = async () => {
        try {
            const res = await fetch("/api/admin/perks");
            const data = await res.json();
            setPerks(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleCreate = async () => {
        try {
            const res = await fetch("/api/admin/perks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPerk)
            });
            if (res.ok) {
                setIsAdding(false);
                setNewPerk({ name: "", description: "", type: "gift", imageUrl: "" });
                fetchPerks();
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 md:p-12">
            <div className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                   <button onClick={() => window.location.href = '/admin/dashboard'} className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-6 hover:text-accent transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Return to Insight
                    </button>
                    <h1 className="text-5xl font-black text-foreground tracking-tighter">Reward <span className="text-primary">Center</span></h1>
                    <p className="text-foreground/40 font-medium mt-2">Manifest virtual perks for thy dedicated seekers.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white h-14 px-8 rounded-2xl font-black shadow-xl shadow-primary/20">
                    <Plus className="w-5 h-5 mr-2" /> Create Perk
                </Button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="max-w-6xl mx-auto mb-10 overflow-hidden">
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input placeholder="Perk Name (e.g. Divine Chocolate)" className="h-14 bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 font-bold border-none outline-none focus:ring-2 focus:ring-primary" value={newPerk.name} onChange={e => setNewPerk({...newPerk, name: e.target.value})} />
                                <select className="h-14 bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 font-bold border-none outline-none focus:ring-2 focus:ring-primary" value={newPerk.type} onChange={e => setNewPerk({...newPerk, type: e.target.value})}>
                                    <option value="gift">Gift</option>
                                    <option value="book">Sacred Book</option>
                                    <option value="access">Course Access</option>
                                    <option value="item">Virtual Item</option>
                                </select>
                            </div>
                            <textarea placeholder="Description of the blessing..." className="w-full h-32 bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 font-bold border-none outline-none focus:ring-2 focus:ring-primary" value={newPerk.description} onChange={e => setNewPerk({...newPerk, description: e.target.value})} />
                            <input placeholder="Image URL (Unsplash or similar)" className="w-full h-14 bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 font-bold border-none outline-none focus:ring-2 focus:ring-primary" value={newPerk.imageUrl} onChange={e => setNewPerk({...newPerk, imageUrl: e.target.value})} />
                            <div className="flex justify-end gap-4">
                                <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                                <Button onClick={handleCreate} className="bg-primary text-white font-black">Manifest Reward</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-primary" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Consulting Treasury...</p>
                    </div>
                ) : perks.map((perk, i) => (
                    <motion.div key={perk.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-xl group">
                        <div className="w-full aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-[2.5rem] mb-6 overflow-hidden flex items-center justify-center relative">
                            {perk.imageUrl ? (
                                <img src={perk.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            ) : (
                                <Gem className="w-16 h-16 text-primary opacity-20" />
                            )}
                            <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-primary">
                                {perk.type}
                            </div>
                        </div>
                        <h3 className="text-xl font-black mb-2">{perk.name}</h3>
                        <p className="text-xs text-foreground/40 font-medium mb-6 line-clamp-2">{perk.description || "A divine reward for consistency."}</p>
                        <Button variant="ghost" className="w-full justify-center text-red-500 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest gap-2">
                            <Trash2 className="w-4 h-4" /> Dissolve Perk
                        </Button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
