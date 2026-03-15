"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sun, Sparkles, Book, Plus, Minus, History, TrendingUp,
    ChevronRight, Heart, Brain, PenTool, Hash, Calendar,
    Loader2, CheckCircle2, ChevronLeft, LayoutGrid, List,
    Settings, Image as ImageIcon, Mic, X, Bookmark, Share2, Star,
    ArrowRight, Trophy, Sparkle, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

const THEMES = [
    { id: "krishna", name: "Krishna", color: "bg-indigo-500", glow: "shadow-indigo-500/50", bg: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&q=80&w=800" },
    { id: "shiva", name: "Shiva", color: "bg-orange-500", glow: "shadow-orange-500/50", bg: "https://images.unsplash.com/photo-1599341620021-00627e1f4fc3?auto=format&fit=crop&q=80&w=800" },
    { id: "devi", name: "Devi", color: "bg-rose-500", glow: "shadow-rose-500/50", bg: "https://images.unsplash.com/photo-1594412852641-0f76378e1bc9?auto=format&fit=crop&q=80&w=800" },
];

export default function SadhanaNexus() {
    const [goals, setGoals] = useState<any[]>([]);
    const [activeGoalIndex, setActiveGoalIndex] = useState(0);
    const [progress, setProgress] = useState<any[]>([]);
    const [historyProgress, setHistoryProgress] = useState<any[]>([]);
    const [historyJournals, setHistoryJournals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // History State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState("current"); // current or history

    // Mantra Japa States
    const [tempRounds, setTempRounds] = useState(1);
    const [mantraName, setMantraName] = useState("");
    const [roundsGoal, setRoundsGoal] = useState(16);
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [showSettings, setShowSettings] = useState(false);

    // Journal States
    const [journals, setJournals] = useState<any[]>([]);
    const [expandedJournal, setExpandedJournal] = useState<number | null>(null);
    const [journalForm, setJournalForm] = useState({ bookName: "", pagesRead: 0, notes: "", mediaUrl: "", mediaType: "" });

    // Library States
    const [library, setLibrary] = useState<any[]>([]);
    const [readingBook, setReadingBook] = useState<any>(null);

    useEffect(() => {
        fetchData();
        fetchLibrary();
    }, []);

    useEffect(() => {
        if (viewMode === "history") {
            fetchHistory();
        }
    }, [selectedDate, viewMode]);

    const fetchData = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) return;

        try {
            const res = await fetch(`/api/sadhana?userId=${user.id}`);
            const data = await res.json();
            
            // Support multiple goals
            const fetchedGoals = Array.isArray(data.goal) ? data.goal : (data.goal ? [data.goal] : []);
            setGoals(fetchedGoals);
            setProgress(data.progress || []);
            setJournals(data.journals || []);
            
            if (fetchedGoals.length > 0) {
                const current = fetchedGoals[activeGoalIndex] || fetchedGoals[0];
                setMantraName(current.mantraName);
                setRoundsGoal(current.dailyRoundsGoal);
                const theme = THEMES.find(t => t.id === current.theme) || THEMES[0];
                setSelectedTheme(theme);
            } else {
                setShowSettings(true);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchHistory = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        try {
            const res = await fetch(`/api/sadhana?userId=${user.id}&date=${selectedDate}`);
            const data = await res.json();
            setHistoryProgress(data.progress || []);
            setHistoryJournals(data.journals || []);
        } catch (e) { console.error(e); }
    };

    const fetchLibrary = async () => {
        try {
            const res = await fetch("/api/library");
            const data = await res.json();
            setLibrary(data);
        } catch (e) { console.error(e); }
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
                await fetchData();
                setShowSettings(false);
            }
        } catch (e) { alert("Failed to manifest mantra"); }
        finally { setSaving(false); }
    };

    const handleAddRounds = async () => {
        const currentGoal = goals[activeGoalIndex];
        if (!currentGoal) return;
        setSaving(true);
        try {
            const res = await fetch("/api/sadhana/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goalId: currentGoal.id, roundsCompleted: tempRounds })
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
                setJournalForm({ bookName: "", pagesRead: 0, notes: "", mediaUrl: "", mediaType: "" });
                fetchData();
            }
        } catch (e) { alert("Failed to record wisdom"); }
        finally { setSaving(false); }
    };

    const activeGoal = goals[activeGoalIndex];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-foreground/40 font-black uppercase tracking-widest text-sm">Synchronizing with Cosmos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

                {/* Header Logic */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 text-center md:text-left">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-foreground tracking-tighter"
                        >
                            Sadhana <span className="text-secondary italic">Nexus</span>
                        </motion.h1>
                        <p className="text-foreground/60 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Laboratory of the Soul</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 justify-center">
                        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
                            <button
                                onClick={() => setViewMode("current")}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'current' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'opacity-40 hover:opacity-100'}`}
                            >
                                Present
                            </button>
                            <button
                                onClick={() => setViewMode("history")}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'history' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'opacity-40 hover:opacity-100'}`}
                            >
                                History
                            </button>
                        </div>

                        {viewMode === "history" && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-900 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group"
                            >
                                <Calendar className="w-4 h-4 text-primary" />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-transparent font-black text-xs border-none focus:outline-none uppercase tracking-widest"
                                />
                            </motion.div>
                        )}
                    </div>
                </div>

                <Tabs defaultValue="japa" className="space-y-12">
                    <TabsList className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-2 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 h-auto self-start shadow-2xl">
                        <TabsTrigger value="japa" className="rounded-2xl px-10 py-5 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-3">
                            <Sun className="w-4 h-4" /> Mantra Japa
                        </TabsTrigger>
                        <TabsTrigger value="journal" className="rounded-2xl px-10 py-5 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-secondary data-[state=active]:text-white transition-all gap-3">
                            <PenTool className="w-4 h-4" /> Spiritual Journal
                        </TabsTrigger>
                        <TabsTrigger value="library" className="rounded-2xl px-10 py-5 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all gap-3">
                            <Book className="w-4 h-4" /> Sacred Library
                        </TabsTrigger>
                    </TabsList>

                    {/* Japa Tab */}
                    <TabsContent value="japa" className="space-y-12">
                        {showSettings ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-zinc-900 rounded-[4rem] p-12 md:p-24 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden"
                            >
                                {goals.length > 0 && (
                                    <Button variant="ghost" className="absolute top-10 left-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 h-12 w-12" onClick={() => setShowSettings(false)}>
                                        <ChevronLeft className="w-6 h-6" />
                                    </Button>
                                )}
                                <div className="max-w-2xl mx-auto text-center space-y-12">
                                    <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto">
                                        <History className="w-12 h-12 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-5xl font-black tracking-tight mb-2">Manifest <span className="text-primary italic">Sacred Vow</span></h2>
                                        <p className="text-foreground/40 font-medium">Commit to thy daily discipline and watch thy soul expand.</p>
                                    </div>
                                    <div className="space-y-8 text-left">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 opacity-50">Thy Chosen Mantra</Label>
                                            <Input
                                                placeholder="e.g. Hare Krishna Maha Mantra"
                                                value={mantraName}
                                                onChange={(e) => setMantraName(e.target.value)}
                                                className="h-20 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 px-10 font-bold text-xl focus:ring-4 focus:ring-primary/10 transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 opacity-50">Daily Rounds Goal</Label>
                                                <Input
                                                    type="number"
                                                    value={roundsGoal}
                                                    onChange={(e) => setRoundsGoal(parseInt(e.target.value))}
                                                    className="h-20 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 px-10 font-bold text-xl focus:ring-4 focus:ring-primary/10 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 opacity-50">Divine Theme</Label>
                                                <div className="flex gap-4 p-2 bg-zinc-50 dark:bg-zinc-950 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800">
                                                    {THEMES.map(theme => (
                                                        <button
                                                            key={theme.id}
                                                            onClick={() => setSelectedTheme(theme)}
                                                            className={`flex-1 h-14 rounded-xl transition-all relative overflow-hidden group ${selectedTheme.id === theme.id ? 'scale-[1.05] z-10' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`}
                                                        >
                                                            <img src={theme.bg} className="w-full h-full object-cover" />
                                                            <div className={`absolute inset-0 bg-black/20 ${selectedTheme.id === theme.id ? 'border-2 border-primary' : ''}`} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleSetupMantra}
                                        disabled={!mantraName || saving}
                                        className="w-full h-24 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {saving ? <Loader2 className="animate-spin" /> : "Seal the Sacred Vow"}
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2 space-y-10">
                                    {/* Multi-Mantra Selector */}
                                    <div className="flex flex-wrap gap-4 px-2">
                                        {goals.map((g, idx) => (
                                            <button
                                                key={g.id}
                                                onClick={() => {
                                                    setActiveGoalIndex(idx);
                                                    const theme = THEMES.find(t => t.id === g.theme) || THEMES[0];
                                                    setSelectedTheme(theme);
                                                }}
                                                className={`px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all border-2 ${activeGoalIndex === idx ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-foreground/40 hover:border-primary/40'}`}
                                            >
                                                {g.mantraName}
                                            </button>
                                        ))}
                                        {goals.length < 3 && (
                                            <button
                                                onClick={() => {
                                                    setMantraName("");
                                                    setRoundsGoal(16);
                                                    setShowSettings(true);
                                                }}
                                                className="w-14 h-14 rounded-full bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-foreground/30 hover:text-primary hover:border-primary transition-all"
                                            >
                                                <Plus className="w-6 h-6" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Japa Counter Card */}
                                    <motion.div
                                        key={activeGoal?.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden rounded-[4rem] border border-white dark:border-white/5 shadow-3xl group min-h-[450px] flex flex-col justify-end p-10 md:p-12"
                                    >
                                        <div className="absolute inset-0 z-0">
                                            <img src={selectedTheme.bg} className="w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                                        </div>

                                        <div className="absolute top-12 right-12 flex gap-4">
                                             <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white">
                                                <Target className="w-4 h-4 text-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Goal: {activeGoal?.dailyRoundsGoal}</span>
                                             </div>
                                             <Button
                                                variant="ghost"
                                                className="bg-white/10 hover:bg-white/20 text-white rounded-2xl p-0 w-12 h-12 backdrop-blur-xl border border-white/20"
                                                onClick={() => {
                                                    setMantraName(activeGoal.mantraName);
                                                    setRoundsGoal(activeGoal.dailyRoundsGoal);
                                                    setShowSettings(true);
                                                }}
                                            >
                                                <Settings className="w-5 h-5" />
                                            </Button>
                                        </div>

                                        <div className="relative z-10 space-y-10">
                                            <div className="space-y-4">
                                                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/40 text-primary text-[10px] font-black uppercase tracking-widest shadow-2xl">
                                                    <Sparkle className="w-4 h-4 animate-pulse" /> Sacred Invocation
                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-2xl">{activeGoal?.mantraName}</h2>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-12">
                                                <div className="flex items-center gap-8 bg-black/40 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-white/10">
                                                    <button
                                                        onClick={() => setTempRounds(Math.max(1, tempRounds - 1))}
                                                        className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all font-black text-3xl text-white border border-white/10"
                                                    >
                                                        -
                                                    </button>
                                                    <div className="text-7xl font-black text-white w-24 text-center tracking-tighter tabular-nums drop-shadow-lg">{tempRounds}</div>
                                                    <button
                                                        onClick={() => setTempRounds(tempRounds + 1)}
                                                        className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all font-black text-3xl text-white border border-white/10"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <Button
                                                    onClick={handleAddRounds}
                                                    disabled={saving || viewMode === 'history'}
                                                    className="h-24 px-12 bg-white text-black hover:bg-zinc-100 rounded-[2.5rem] font-black text-xl shadow-3xl transition-all grow group/btn w-full sm:w-auto overflow-hidden relative"
                                                >
                                                    {saving ? <Loader2 className="animate-spin" /> : (
                                                        <span className="flex items-center gap-6">Manifest {tempRounds} Rounds <ArrowRight className="w-8 h-8 group-hover/btn:translate-x-3 transition-transform text-primary" /></span>
                                                    )}
                                                    {viewMode === 'history' && <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center text-white text-[10px] font-black uppercase tracking-[0.4em]">Historical Gaze Only</div>}
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Side Stats / History View */}
                                <div className="space-y-10">
                                    <motion.div 
                                        whileHover={{ y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden active:bg-zinc-950 transition-colors group"
                                    >
                                        <div className="absolute top-0 right-0 p-8">
                                            <Trophy className="w-10 h-10 text-primary opacity-20 group-active:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 mb-8 group-active:text-white/40 transition-colors">{viewMode === 'history' ? `Realization: ${selectedDate}` : "Spiritual Momentum"}</h3>
                                        <div className="space-y-10">
                                            <div className="flex justify-between items-end">
                                                <div className="group-active:text-white transition-colors">
                                                    <div className="text-7xl font-black tracking-tighter tabular-nums">
                                                        {(viewMode === 'history' ? historyProgress : progress).filter(p => p.goalId === activeGoal?.id).reduce((acc, p) => acc + p.roundsCompleted, 0)}
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2">Rounds Manifested Today</p>
                                                </div>
                                                <div className="text-primary font-black text-2xl tracking-tighter italic group-active:text-primary-foreground transition-colors">
                                                    {Math.min(100, Math.round((((viewMode === 'history' ? historyProgress : progress).filter(p => p.goalId === activeGoal?.id).reduce((acc, p) => acc + p.roundsCompleted, 0)) / (activeGoal?.dailyRoundsGoal || 1)) * 100))}%
                                                </div>
                                            </div>
                                            <div className="w-full h-5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner p-1 group-active:bg-zinc-800 transition-colors">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (((viewMode === 'history' ? historyProgress : progress).filter(p => p.goalId === activeGoal?.id).reduce((acc, p) => acc + p.roundsCompleted, 0)) / (activeGoal?.dailyRoundsGoal || 1)) * 100)}%` }}
                                                    className="h-full bg-primary rounded-full shadow-lg shadow-primary/40 relative"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {viewMode === 'current' ? (
                                        <div className="bg-white dark:bg-zinc-900 p-12 rounded-[4rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-8">
                                            <div className="flex items-center gap-4">
                                                <TrendingUp className="text-secondary w-8 h-8" />
                                                <h3 className="text-2xl font-black tracking-tight">Expansion Trend</h3>
                                            </div>
                                            <div className="h-48 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={progress.filter(p => p.goalId === activeGoal?.id)}>
                                                        <defs>
                                                            <linearGradient id="colorRounds" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.4} />
                                                                <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <Area type="monotone" dataKey="roundsCompleted" stroke="var(--secondary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRounds)" />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: 'black', border: 'none', borderRadius: '1.5rem', color: 'white', fontWeight: '900', fontSize: '12px', padding: '12px 20px' }}
                                                            itemStyle={{ color: 'var(--secondary)' }}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-8 ml-2">Chronicle of Rounds</h4>
                                            {historyProgress.filter(p => p.goalId === activeGoal?.id).length === 0 ? (
                                                <div className="text-center py-10">
                                                     <Sparkle className="w-8 h-8 text-primary/10 mx-auto mb-4" />
                                                     <p className="text-xs font-bold italic text-foreground/60">No mantras logged on this cycle.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                                    {historyProgress.filter(p => p.goalId === activeGoal?.id).map((p, i) => (
                                                        <motion.div 
                                                            key={i} 
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                                                        >
                                                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            <span className="px-5 py-2 bg-primary text-white rounded-xl text-[10px] font-black shadow-lg shadow-primary/20">{p.roundsCompleted} Rounds</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* Journal Tab */}
                    <TabsContent value="journal" className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Log New Entry */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-12 md:p-16 rounded-[4rem] shadow-3xl">
                                <div className="space-y-12">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-secondary/10 rounded-[2rem] flex items-center justify-center">
                                            <PenTool className="w-8 h-8 text-secondary" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black tracking-tighter">Wisdom <span className="text-secondary italic">Log</span></h2>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Anchor thy realizations</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAddJournal} className="space-y-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">The Sacred Source</Label>
                                            <Input
                                                placeholder="e.g. Bhagavad Gita"
                                                value={journalForm.bookName}
                                                onChange={(e) => setJournalForm({ ...journalForm, bookName: e.target.value })}
                                                className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 px-8 font-bold text-lg focus:ring-4 focus:ring-secondary/10 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Pages Explored</Label>
                                            <Input
                                                type="number"
                                                value={journalForm.pagesRead}
                                                onChange={(e) => setJournalForm({ ...journalForm, pagesRead: parseInt(e.target.value) })}
                                                className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 px-8 font-bold text-lg focus:ring-4 focus:ring-secondary/10 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Thy Inner Sight</Label>
                                            <textarea
                                                placeholder="What did your soul witness today?"
                                                value={journalForm.notes}
                                                onChange={(e) => setJournalForm({ ...journalForm, notes: e.target.value })}
                                                className="w-full min-h-[200px] p-8 bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 rounded-3xl font-bold text-base focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <button type="button" className="flex-1 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:bg-secondary/10 hover:text-secondary transition-all">
                                                <ImageIcon className="w-5 h-5" /> Image
                                            </button>
                                            <button type="button" className="flex-1 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:bg-secondary/10 hover:text-secondary transition-all">
                                                <Mic className="w-5 h-5" /> Voice
                                            </button>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={saving || viewMode === 'history'}
                                            className="w-full h-20 bg-secondary hover:bg-secondary/90 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-secondary/30 relative overflow-hidden"
                                        >
                                            {saving ? <Loader2 className="animate-spin" /> : "Anchor Wisdom"}
                                            {viewMode === 'history' && <div className="absolute inset-0 bg-black/80 rounded-[2rem] backdrop-blur-md flex items-center justify-center text-white text-[10px] font-black tracking-[0.4em]">Historical View Only</div>}
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            {/* Journal Feed */}
                            <div className="lg:col-span-2 space-y-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 px-6">{viewMode === 'history' ? `Chronicle for ${selectedDate}` : "Divine Realizations"}</h3>
                                {(viewMode === 'history' ? historyJournals : journals).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-48 bg-white dark:bg-zinc-900 rounded-[5rem] border-4 border-dashed border-zinc-100 dark:border-zinc-800 shadow-2xl">
                                        <Book className="w-20 h-20 text-foreground/5 mb-8" />
                                        <p className="text-foreground/30 font-black italic text-xl tracking-tight">The pages remain blank, awaiting thy wisdom.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {(viewMode === 'history' ? historyJournals : journals).map((j, i) => (
                                            <motion.div
                                                key={i}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                onClick={() => setExpandedJournal(expandedJournal === i ? null : i)}
                                                className={`p-10 rounded-[3.5rem] border-2 transition-all cursor-pointer shadow-xl ${expandedJournal === i ? 'bg-secondary text-white border-secondary scale-[1.02] shadow-secondary/30 z-20' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-secondary/40 hover:shadow-2xl'}`}
                                            >
                                                <div className="flex justify-between items-start mb-8">
                                                    <div>
                                                        <h4 className={`font-black text-3xl tracking-tighter uppercase mb-2 ${expandedJournal === i ? 'text-white' : 'text-foreground'}`}>{j.bookName}</h4>
                                                        <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] w-fit ${expandedJournal === i ? 'bg-white/20 text-white' : 'bg-secondary/10 text-secondary'}`}>
                                                            {j.pagesRead} Pages Explored
                                                        </div>
                                                    </div>
                                                    <div className={`text-[10px] font-black opacity-40 tracking-widest uppercase ${expandedJournal === i ? 'text-white' : 'text-foreground'}`}>{new Date(j.date).toLocaleDateString()}</div>
                                                </div>
                                                
                                                <p className={`text-lg font-medium leading-[1.7] italic ${expandedJournal === i ? 'text-white opacity-95' : 'text-foreground/70 line-clamp-3'}`}>
                                                    "{j.notes}"
                                                </p>

                                                {expandedJournal === i && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="pt-10 flex flex-col gap-8"
                                                    >
                                                        {j.mediaUrl && j.mediaType === 'image' && (
                                                            <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white/20">
                                                                <img src={j.mediaUrl} className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                        {j.mediaUrl && j.mediaType === 'voice' && (
                                                            <div className="p-6 bg-white/10 rounded-2xl flex items-center gap-6 border border-white/20">
                                                                <div className="w-12 h-12 bg-white text-secondary rounded-full flex items-center justify-center">
                                                                    <Mic className="w-6 h-6" />
                                                                </div>
                                                                <div className="flex-1 h-2 bg-white/20 rounded-full relative overflow-hidden">
                                                                    <div className="absolute inset-0 bg-white w-1/3" />
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase">Play Voice Reflection</span>
                                                            </div>
                                                        )}
                                                        <div className="flex gap-4 border-t border-white/20 pt-8">
                                                            <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-2xl flex-1 h-14 font-black uppercase tracking-widest text-[10px] gap-3">
                                                                <Share2 className="w-4 h-4" /> Share Wisdom
                                                            </Button>
                                                            <Button variant="ghost" className="bg-white text-secondary hover:bg-zinc-100 rounded-2xl flex-1 h-14 font-black uppercase tracking-widest text-[10px] gap-3">
                                                                <Star className="w-4 h-4" /> Heart Reflection
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Library Tab */}
                    <TabsContent value="library" className="space-y-12">
                        <AnimatePresence mode="wait">
                            {!readingBook ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-12"
                                >
                                    <div className="flex justify-between items-end px-6">
                                        <div>
                                            <h2 className="text-5xl font-black tracking-tighter">Sacred <span className="text-orange-500 italic">Manuscripts</span></h2>
                                            <p className="text-foreground/40 font-black text-xs uppercase tracking-[0.4em] mt-2">Gateways to the Absolute</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                                        {library.map((book) => (
                                            <motion.div
                                                key={book.id}
                                                whileHover={{ y: -20, rotate: 1 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="bg-white dark:bg-zinc-900 rounded-[4rem] overflow-hidden group cursor-pointer shadow-3xl relative border border-zinc-100 dark:border-zinc-800 active:bg-zinc-950 active:border-orange-500/50 transition-all"
                                                onClick={() => setReadingBook(book)}
                                            >
                                                <div className="aspect-[3/4.5] overflow-hidden relative">
                                                    <img src={book.coverUrl} className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-active:from-orange-950/80 transition-all" />
                                                    <div className="absolute top-8 left-8">
                                                        <div className="px-5 py-2.5 bg-white/20 backdrop-blur-xl border border-white/40 rounded-full text-[8px] font-black uppercase tracking-[0.3em] text-white shadow-2xl">Sacred Text</div>
                                                    </div>
                                                </div>
                                                <div className="p-10 space-y-4">
                                                    <h3 className="text-3xl font-black group-hover:text-orange-500 group-active:text-white transition-colors tracking-tighter uppercase">{book.title}</h3>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 group-active:text-orange-400">{book.author}</p>
                                                    <p className="text-sm text-foreground/50 font-medium italic line-clamp-2 leading-relaxed group-active:text-white/40">{book.description || "A timeless vessel of spiritual illumination."}</p>
                                                    <div className="pt-8 flex justify-between items-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-3">Commence Reading <ArrowRight className="w-4 h-4" /></span>
                                                        <div className="flex gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"><Bookmark className="w-4 h-4" /></div>
                                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"><Share2 className="w-4 h-4" /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="bg-orange-50 dark:bg-zinc-950 rounded-[5rem] min-h-[900px] border border-orange-200 dark:border-zinc-800 shadow-3xl flex flex-col items-center p-12 md:p-24 relative overflow-hidden"
                                >
                                    <div className="absolute -left-20 -top-20 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
                                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />

                                    <Button
                                        variant="ghost"
                                        className="absolute top-12 left-12 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-orange-200 dark:border-white/10 h-14 px-8 font-black uppercase tracking-widest text-[10px] gap-3"
                                        onClick={() => setReadingBook(null)}
                                    >
                                        <ChevronLeft className="w-5 h-5" /> Library
                                    </Button>

                                    <div className="max-w-4xl w-full text-center space-y-20 py-20 relative z-10">
                                        <div className="space-y-6">
                                            <h2 className="text-7xl font-black italic tracking-tighter text-orange-900 dark:text-orange-500 drop-shadow-sm">{readingBook.title}</h2>
                                            <div className="inline-flex items-center gap-4 px-6 py-2 bg-orange-900/5 dark:bg-orange-500/10 rounded-full">
                                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-900 dark:text-orange-400">Chapter 1 • Verse 1</p>
                                            </div>
                                        </div>

                                        <div className="p-16 md:p-24 bg-white dark:bg-zinc-900 rounded-[5rem] shadow-inner text-left space-y-16 border border-orange-100 dark:border-zinc-800 min-h-[600px] relative">
                                            <div className="absolute top-12 right-12 flex gap-4">
                                                <Button size="icon" variant="ghost" className="w-14 h-14 rounded-2xl hover:bg-orange-100 dark:hover:bg-zinc-800 transition-all"><Bookmark className="w-6 h-6 text-orange-500" /></Button>
                                                <Button size="icon" variant="ghost" className="w-14 h-14 rounded-2xl hover:bg-orange-100 dark:hover:bg-zinc-800 transition-all"><Share2 className="w-6 h-6" /></Button>
                                            </div>

                                            <div className="space-y-12">
                                                <p className="text-5xl font-serif italic text-orange-900 dark:text-orange-200 leading-[1.3] drop-shadow-sm border-l-8 border-orange-500 pl-12">
                                                    "dharmakṣetre kurukṣetre samavetā yuyutsavaḥ | <br />
                                                    māmakāḥ pāṇḍavāścaiva kimakurvata sañjaya ||"
                                                </p>

                                                <div className="space-y-8">
                                                    <p className="text-2xl font-black tracking-tight text-orange-900 dark:text-orange-500 uppercase opacity-60 ml-1">Translation & Purport</p>
                                                    <p className="text-2xl font-medium leading-[1.8] text-foreground/80 first-letter:text-5xl first-letter:font-black first-letter:text-orange-500 first-letter:mr-2">
                                                        King Dhritarashtra said: O Sanjaya, after my sons and the sons of Pandu assembled in the place of pilgrimage at Kurukshetra, desiring to fight, what did they do?
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-16 border-t border-orange-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-10 mt-auto">
                                                <div className="flex items-center gap-4">
                                                     <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                                        {[1,2,3,4,5].map(p => (
                                                            <div key={p} className={`w-2 h-2 rounded-full mx-1 ${p === 1 ? 'bg-orange-500' : 'bg-zinc-200'}`} />
                                                        ))}
                                                     </div>
                                                     <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Sloka 1 of 700</span>
                                                </div>
                                                <div className="flex gap-6 w-full sm:w-auto">
                                                    <Button variant="ghost" className="flex-1 rounded-3xl font-black text-[10px] uppercase tracking-widest px-10 h-16 border-2 border-orange-100 group hover:bg-orange-50">
                                                        <ChevronLeft className="w-5 h-5 mr-3 group-hover:-translate-x-2 transition-transform" /> Previous
                                                    </Button>
                                                    <Button className="flex-1 rounded-3xl font-black text-[10px] uppercase tracking-widest px-12 h-16 bg-orange-500 hover:bg-orange-600 text-white shadow-2xl shadow-orange-500/30 group">
                                                        Next Sloka <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
