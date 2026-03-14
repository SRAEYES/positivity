"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Sun, Sparkles, Book, Plus, Minus, History, TrendingUp, 
    ChevronRight, Heart, Brain, PenTool, Hash, Calendar,
    Loader2, CheckCircle2, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";

const THEMES = [
    { id: "krishna", name: "Krishna", color: "bg-indigo-500", glow: "shadow-indigo-500/50", bg: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&q=80&w=800" },
    { id: "shiva", name: "Shiva", color: "bg-orange-500", glow: "shadow-orange-500/50", bg: "https://images.unsplash.com/photo-1599341620021-00627e1f4fc3?auto=format&fit=crop&q=80&w=800" },
    { id: "devi", name: "Devi", color: "bg-rose-500", glow: "shadow-rose-500/50", bg: "https://images.unsplash.com/photo-1594412852641-0f76378e1bc9?auto=format&fit=crop&q=80&w=800" },
];

export default function SadhanaNexus() {
    const [goal, setGoal] = useState<any>(null);
    const [progress, setProgress] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Mantra Japa States
    const [tempRounds, setTempRounds] = useState(1);
    const [mantraName, setMantraName] = useState("");
    const [roundsGoal, setRoundsGoal] = useState(16);
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

    // Journal States
    const [journals, setJournals] = useState<any[]>([]);
    const [journalForm, setJournalForm] = useState({ bookName: "", pagesRead: 0, notes: "" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) return;

        try {
            const res = await fetch(`/api/sadhana?userId=${user.id}`);
            const data = await res.json();
            setGoal(data.goal);
            setProgress(data.progress || []);
            setJournals(data.journals || []);
            if (data.goal) {
                setMantraName(data.goal.mantraName);
                setRoundsGoal(data.goal.dailyRoundsGoal);
                const theme = THEMES.find(t => t.id === data.goal.theme) || THEMES[0];
                setSelectedTheme(theme);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSetupMantra = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setSaving(true);
        try {
            const res = await fetch("/api/sadhana/goal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, mantraName, dailyRoundsGoal: roundsGoal, theme: selectedTheme.id })
            });
            if (res.ok) {
                const data = await res.json();
                setGoal(data.goal);
            }
        } catch (e) { alert("Failed to manifest mantra"); }
        finally { setSaving(false); }
    };

    const handleAddRounds = async () => {
        if (!goal) return;
        setSaving(true);
        try {
            const res = await fetch("/api/sadhana/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goalId: goal.id, roundsCompleted: tempRounds })
            });
            if (res.ok) {
                fetchData();
                setTempRounds(1);
            }
        } catch (e) { alert("Failed to log progress"); }
        finally { setSaving(false); }
    };

    const handleAddJournal = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setSaving(true);
        try {
            const res = await fetch("/api/sadhana/journal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, ...journalForm })
            });
            if (res.ok) {
                setJournalForm({ bookName: "", pagesRead: 0, notes: "" });
                fetchData();
            }
        } catch (e) { alert("Failed to record wisdom"); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-foreground/40 font-black uppercase tracking-widest text-sm">Synchronizing with Cosmos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl font-black text-foreground tracking-tighter italic"
                        >
                            Sadhana <span className="text-secondary">Nexus</span>
                        </motion.h1>
                        <p className="text-foreground/40 font-black uppercase tracking-[0.3em] text-xs mt-2">Laboratory of the Soul</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-6 py-3 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 shadow-sm flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-bold text-sm tracking-tight">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="japa" className="space-y-12">
                    <TabsList className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-2 rounded-[2rem] border border-white dark:border-white/5 h-auto self-start">
                        <TabsTrigger value="japa" className="rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
                            <Sun className="w-4 h-4" /> Mantra Japa
                        </TabsTrigger>
                        <TabsTrigger value="journal" className="rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-secondary data-[state=active]:text-white transition-all gap-2">
                            <PenTool className="w-4 h-4" /> Spiritual Journal
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="japa" className="space-y-12">
                        {!goal ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-zinc-900 rounded-[4rem] p-12 md:p-20 shadow-2xl border border-zinc-100 dark:border-zinc-800"
                            >
                                <div className="max-w-2xl mx-auto text-center space-y-10">
                                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto">
                                        <History className="w-10 h-10 text-primary" />
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight">Establish Your Daily Vow</h2>
                                    <div className="space-y-6 text-left">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-40">Thy Chosen Mantra</Label>
                                            <Input 
                                                placeholder="e.g. Hare Krishna Maha Mantra" 
                                                value={mantraName}
                                                onChange={(e) => setMantraName(e.target.value)}
                                                className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent px-8 font-bold text-lg"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-40">Daily Rounds Goal</Label>
                                                <Input 
                                                    type="number"
                                                    value={roundsGoal}
                                                    onChange={(e) => setRoundsGoal(parseInt(e.target.value))}
                                                    className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent px-8 font-bold text-lg"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-40">Divine Theme</Label>
                                                <div className="flex gap-3 mt-1">
                                                    {THEMES.map(theme => (
                                                        <button 
                                                            key={theme.id}
                                                            onClick={() => setSelectedTheme(theme)}
                                                            className={`w-12 h-12 rounded-xl transition-all ${theme.color} ${selectedTheme.id === theme.id ? 'scale-110 shadow-xl ' + theme.glow : 'opacity-40 hover:opacity-100'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={handleSetupMantra}
                                        disabled={!mantraName || saving}
                                        className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/20"
                                    >
                                        {saving ? <Loader2 className="animate-spin" /> : "Seal the Sacred Vow"}
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Japa Counter Card */}
                                <motion.div 
                                    className="lg:col-span-2 relative overflow-hidden rounded-[4rem] border border-white dark:border-white/5 shadow-2xl group min-h-[600px] flex flex-col justify-end p-12"
                                >
                                    <div className="absolute inset-0 z-0">
                                        <img src={selectedTheme.bg} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    </div>
                                    
                                    <div className="relative z-10 space-y-8">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                                            <Heart className="w-3 h-3 text-rose-400" /> Currently chanting
                                        </div>
                                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">{goal.mantraName}</h2>
                                        
                                        <div className="flex items-center gap-10">
                                            <div className="flex items-center gap-6">
                                                <button 
                                                    onClick={() => setTempRounds(Math.max(1, tempRounds - 1))}
                                                    className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
                                                >
                                                    <Minus className="text-white w-8 h-8" />
                                                </button>
                                                <div className="text-6xl font-black text-white w-20 text-center">{tempRounds}</div>
                                                <button 
                                                    onClick={() => setTempRounds(tempRounds + 1)}
                                                    className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
                                                >
                                                    <Plus className="text-white w-8 h-8" />
                                                </button>
                                            </div>
                                            <Button 
                                                onClick={handleAddRounds}
                                                disabled={saving}
                                                className="h-24 px-12 bg-white text-black hover:bg-zinc-100 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all grow group/btn"
                                            >
                                                {saving ? <Loader2 className="animate-spin" /> : (
                                                    <span className="flex items-center gap-4">Log {tempRounds} Rounds <ChevronRight className="w-8 h-8 group-hover/btn:translate-x-2 transition-transform" /></span>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Side Stats */}
                                <div className="space-y-8">
                                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-10 rounded-[3rem] shadow-xl">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">Daily Ascension</h3>
                                        <div className="space-y-8">
                                            <div className="flex justify-between items-end">
                                                <div className="text-5xl font-black">{progress.reduce((acc, p) => acc + p.roundsCompleted, 0)} <span className="text-lg opacity-20">/ {goal.dailyRoundsGoal}</span></div>
                                                <div className="text-primary font-black text-sm tracking-tight">{Math.min(100, Math.round((progress.reduce((acc, p) => acc + p.roundsCompleted, 0) / goal.dailyRoundsGoal) * 100))}% Completed</div>
                                            </div>
                                            <div className="w-full h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (progress.reduce((acc, p) => acc + p.roundsCompleted, 0) / goal.dailyRoundsGoal) * 100)}%` }}
                                                    className="h-full bg-primary glow-saffron"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-primary p-1 rounded-[3rem] shadow-2xl">
                                        <div className="bg-white dark:bg-zinc-950 p-10 rounded-[2.8rem] space-y-6">
                                            <TrendingUp className="text-primary w-8 h-8" />
                                            <h3 className="text-2xl font-black tracking-tight">Growth Trend</h3>
                                            <div className="h-40 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={progress}>
                                                        <defs>
                                                            <linearGradient id="colorRounds" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <Area type="monotone" dataKey="roundsCompleted" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRounds)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="journal" className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Log New Entry */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-10 md:p-12 rounded-[4rem] shadow-xl">
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                                            <PenTool className="w-6 h-6 text-secondary" />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tighter">Wisdom Log</h2>
                                    </div>

                                    <form onSubmit={handleAddJournal} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">The Sacred Book</Label>
                                            <Input 
                                                placeholder="e.g. SRIMAD BHAGAVATAM" 
                                                value={journalForm.bookName}
                                                onChange={(e) => setJournalForm({...journalForm, bookName: e.target.value})}
                                                className="h-14 rounded-xl bg-zinc-50 dark:bg-black border-transparent font-bold capitalize"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Pages Immersed</Label>
                                            <Input 
                                                type="number"
                                                value={journalForm.pagesRead}
                                                onChange={(e) => setJournalForm({...journalForm, pagesRead: parseInt(e.target.value)})}
                                                className="h-14 rounded-xl bg-zinc-50 dark:bg-black border-transparent font-bold"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Thy Realizations</Label>
                                            <textarea 
                                                placeholder="What did your soul learn today?"
                                                value={journalForm.notes}
                                                onChange={(e) => setJournalForm({...journalForm, notes: e.target.value})}
                                                className="w-full min-h-[160px] p-6 bg-zinc-50 dark:bg-black border-transparent rounded-2xl font-bold text-sm focus:outline-none"
                                            />
                                        </div>
                                        <Button 
                                            type="submit"
                                            disabled={saving}
                                            className="w-full h-16 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-secondary/20"
                                        >
                                            {saving ? <Loader2 className="animate-spin" /> : "Record Realization"}
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            {/* Journal Feed */}
                            <div className="lg:col-span-2 space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-4">Previous Realizations</h3>
                                {journals.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-zinc-900/50 rounded-[4rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800">
                                        <Book className="w-12 h-12 text-foreground/10 mb-6" />
                                        <p className="text-foreground/40 font-black italic">The pages remain blank, awaiting thy wisdom.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {journals.map((j, i) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 space-y-4"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-black text-xl tracking-tight uppercase">{j.bookName}</h4>
                                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{j.pagesRead} Pages Read</p>
                                                    </div>
                                                    <div className="text-[10px] font-black opacity-30">{new Date(j.date).toLocaleDateString()}</div>
                                                </div>
                                                <p className="text-sm font-medium text-foreground/70 italic leading-relaxed">
                                                    "{j.notes}"
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
