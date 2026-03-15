"use client";

import { useState, useEffect } from "react";
import { Trophy, Plus, Gift, Trash2, Loader2, ArrowLeft, Gem, UserPlus, X, Search, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AdminRewards() {
    const [perks, setPerks] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isAssigning, setIsAssigning] = useState<any>(null); // Holds the perk to assign
    const [searchQuery, setSearchQuery] = useState("");
    
    const [newPerk, setNewPerk] = useState<any>({
        name: "",
        description: "",
        type: "gift",
        imageUrl: "",
        userIds: []
    });

    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [pRes, uRes] = await Promise.all([
                fetch("/api/admin/perks"),
                fetch("/api/admin/users")
            ]);
            const pData = await pRes.json();
            const uData = await uRes.json();
            setPerks(Array.isArray(pData) ? pData : (pData.perks || []));
            setUsers(uData);
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
                setNewPerk({ name: "", description: "", type: "gift", imageUrl: "", userIds: [] });
                fetchAll();
                setStatusMessage("Perk created and assigned!");
                setTimeout(() => setStatusMessage(""), 2000);
            }
        } catch (e) { console.error(e); }
    };

    const toggleUserSelection = (userId: number) => {
        setNewPerk((prev: any) => ({
            ...prev,
            userIds: prev.userIds.includes(userId)
                ? prev.userIds.filter((id: number) => id !== userId)
                : [...prev.userIds, userId]
        }));
    };

    const assignPerk = async (userId: number) => {
        if (!isAssigning) return;
        try {
            setStatusMessage("Assigning...");
            const res = await fetch("/api/admin/perks/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, perkId: isAssigning.id })
            });
            if (res.ok) {
                setStatusMessage("Assigned successfully!");
                setTimeout(() => {
                    setIsAssigning(null);
                    setStatusMessage("");
                }, 1500);
            }
        } catch (e) { 
            console.error(e); 
            setStatusMessage("Failed to assign.");
        }
    };

    const deletePerk = async (id: number) => {
        if (!confirm("Dissolve this perk? It will be removed from all seekers.")) return;
         try {
            await fetch(`/api/admin/perks?id=${id}`, { method: "DELETE" });
            fetchAll();
        } catch (e) { console.error(e); }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white p-8 md:p-12 text-zinc-900">
            <div className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                   <button onClick={() => window.location.href = '/admin/dashboard'} className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-6 hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Return to Insight
                    </button>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Reward <span className="text-primary italic">Center</span></h1>
                    <p className="text-zinc-400 font-bold mt-2 uppercase text-[10px] tracking-widest italic leading-relaxed">Manifest virtual perks for thy dedicated seekers.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white h-14 px-8 rounded-2xl font-black shadow-xl shadow-primary/20">
                    <Plus className="w-5 h-5 mr-2" /> Manifest Perk
                </Button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="max-w-6xl mx-auto mb-10 overflow-hidden">
                        <div className="bg-zinc-50 p-8 rounded-[3rem] border border-zinc-100 shadow-sm space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input placeholder="Perk Name (e.g. Divine Chocolate)" className="h-14 bg-white rounded-xl px-4 font-bold border border-zinc-100 outline-none focus:ring-2 focus:ring-primary" value={newPerk.name} onChange={e => setNewPerk({...newPerk, name: e.target.value})} />
                                <select className="h-14 bg-white rounded-xl px-4 font-bold border border-zinc-100 outline-none focus:ring-2 focus:ring-primary" value={newPerk.type} onChange={e => setNewPerk({...newPerk, type: e.target.value})}>
                                    <option value="gift">Gift</option>
                                    <option value="book">Sacred Book</option>
                                    <option value="access">Course Access</option>
                                    <option value="item">Virtual Item</option>
                                </select>
                            </div>
                            <textarea placeholder="Description of the blessing..." className="w-full h-32 bg-white rounded-xl p-4 font-bold border border-zinc-100 outline-none focus:ring-2 focus:ring-primary resize-none" value={newPerk.description} onChange={e => setNewPerk({...newPerk, description: e.target.value})} />
                            <input placeholder="Image URL (Unsplash or similar)" className="w-full h-14 bg-white rounded-xl px-4 font-bold border border-zinc-100 outline-none focus:ring-2 focus:ring-primary" value={newPerk.imageUrl} onChange={e => setNewPerk({...newPerk, imageUrl: e.target.value})} />
                            
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Select Seekers for this Blessing</p>
                                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-4 bg-white rounded-2xl border border-zinc-100">
                                    {users.map(u => (
                                        <button
                                            key={u.id}
                                            onClick={() => toggleUserSelection(u.id)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                newPerk.userIds.includes(u.id)
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                    : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                                            }`}
                                        >
                                            {u.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button variant="ghost" onClick={() => setIsAdding(false)} className="font-bold">Discard</Button>
                                <Button onClick={handleCreate} className="bg-primary text-white font-black px-10 h-14 rounded-2xl">Manifest Perk</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-primary w-10 h-10" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Consulting Treasury...</p>
                    </div>
                ) : perks.map((perk, i) => (
                    <motion.div key={perk.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white p-8 rounded-[3.5rem] border border-zinc-100 shadow-xl group flex flex-col">
                        <div className="w-full aspect-[4/3] bg-zinc-50 rounded-[2.5rem] mb-6 overflow-hidden flex items-center justify-center relative border border-zinc-50">
                            {perk.imageUrl ? (
                                <img src={perk.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            ) : (
                                <Gem className="w-16 h-16 text-primary opacity-20" />
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-primary shadow-sm border border-zinc-100">
                                {perk.type}
                            </div>
                        </div>
                        <h3 className="text-2xl font-black mb-2 tracking-tight">{perk.name}</h3>
                        <p className="text-xs text-zinc-400 font-medium mb-8 line-clamp-2 italic leading-relaxed">{perk.description || "A divine reward for consistency."}</p>
                        
                        <div className="mt-auto space-y-3">
                            <Button onClick={() => setIsAssigning(perk)} className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-zinc-200">
                                <UserPlus className="w-4 h-4" /> Assign to Seeker
                            </Button>
                            <Button variant="ghost" onClick={() => deletePerk(perk.id)} className="w-full h-12 rounded-xl text-rose-500 hover:bg-rose-50 font-black uppercase text-[10px] tracking-widest gap-2">
                                <Trash2 className="w-4 h-4" /> Dissolve
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Assignment Modal */}
            <AnimatePresence>
                {isAssigning && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[3.5rem] flex flex-col relative shadow-[0_32px_128px_rgba(0,0,0,0.15)] border border-zinc-100">
                            <button onClick={() => setIsAssigning(null)} className="absolute top-8 right-8 w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 hover:bg-red-50 hover:text-red-500 transition-all z-10">
                                <X className="w-6 h-6" />
                            </button>

                            <div className="p-10 md:p-14 border-b border-zinc-50">
                                <h2 className="text-4xl font-black mb-2 tracking-tighter italic">Bestow <span className="text-primary">{isAssigning.name}</span></h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Select a seeker to receive this blessing</p>
                            </div>

                            <div className="p-6 md:p-10 bg-zinc-50/50">
                                <div className="relative mb-6">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by name or email..." 
                                        className="w-full h-16 bg-white border border-zinc-100 rounded-3xl pl-16 pr-6 font-bold text-lg outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                                    {filteredUsers.length === 0 ? (
                                        <p className="text-center py-10 text-zinc-400 font-medium italic">No seekers found in our records...</p>
                                    ) : filteredUsers.map(user => (
                                        <div key={user.id} className="bg-white p-4 rounded-2xl border border-zinc-50 flex items-center justify-between group hover:border-primary transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-zinc-100 rounded-xl overflow-hidden">
                                                    {user.imageUrl ? <img src={`/api/user/image/${user.id}`} className="w-full h-full object-cover" /> : <Gem className="w-full h-full p-3 text-zinc-300" />}
                                                </div>
                                                <div>
                                                    <p className="font-black tracking-tight">{user.name}</p>
                                                    <p className="text-[10px] font-medium text-zinc-400">{user.email}</p>
                                                </div>
                                            </div>
                                            <Button 
                                                onClick={() => assignPerk(user.id)}
                                                className="bg-primary/5 hover:bg-primary text-primary hover:text-white px-6 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Bestow
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {statusMessage && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex items-center justify-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                                        <CheckCircle2 className="w-5 h-5" /> {statusMessage}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
