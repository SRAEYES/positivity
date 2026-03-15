"use client";

import { useState, useEffect } from "react";
import { Gamepad2, Plus, Ghost, Brain, Timer, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AdminGames() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [newQuiz, setNewQuiz] = useState({
        title: "",
        description: "",
        questions: [{ text: "", options: ["", "", "", ""], correctAnswer: "" }]
    });

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await fetch("/api/admin/games");
            const data = await res.json();
            setQuizzes(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleAddQuestion = () => {
        setNewQuiz({
            ...newQuiz,
            questions: [...newQuiz.questions, { text: "", options: ["", "", "", ""], correctAnswer: "" }]
        });
    };

    const handleCreateQuiz = async () => {
        try {
            const res = await fetch("/api/admin/games", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newQuiz)
            });
            if (res.ok) {
                setIsCreating(false);
                setNewQuiz({ title: "", description: "", questions: [{ text: "", options: ["", "", "", ""], correctAnswer: "" }] });
                fetchQuizzes();
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
                    <h1 className="text-5xl font-black text-foreground tracking-tighter">Spiritual <span className="text-accent">Arena</span></h1>
                    <p className="text-foreground/40 font-medium mt-2">Manage interactive Vedic challenges and games.</p>
                </div>
                <Button onClick={() => setIsCreating(true)} className="bg-accent text-white h-14 px-8 rounded-2xl font-black shadow-xl shadow-accent/20">
                    <Plus className="w-5 h-5 mr-2" /> Conduct New Quiz
                </Button>
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-10 md:p-16 relative shadow-2xl">
                            <h2 className="text-4xl font-black mb-8">Manifest <span className="text-accent italic">Wisdom Quest</span></h2>
                            
                            <div className="space-y-8">
                                <div className="grid gap-4">
                                    <input placeholder="Quiz Title (e.g. Gita Chapter 1)" className="h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl px-6 font-bold text-xl outline-none focus:ring-2 focus:ring-accent" value={newQuiz.title} onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} />
                                    <textarea placeholder="Brief description..." className="h-24 bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 font-bold outline-none focus:ring-2 focus:ring-accent" value={newQuiz.description} onChange={e => setNewQuiz({...newQuiz, description: e.target.value})} />
                                </div>

                                <div className="space-y-12">
                                    {newQuiz.questions.map((q, qidx) => (
                                        <div key={qidx} className="p-8 bg-zinc-50 dark:bg-zinc-800 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-700 space-y-6">
                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-30">Question {qidx + 1}</h4>
                                            <input placeholder="Enter the question..." className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-600 py-3 font-bold text-lg outline-none focus:border-accent" value={q.text} onChange={e => {
                                                const qus = [...newQuiz.questions];
                                                qus[qidx].text = e.target.value;
                                                setNewQuiz({...newQuiz, questions: qus});
                                            }} />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {q.options.map((opt, oidx) => (
                                                    <input key={oidx} placeholder={`Option ${oidx + 1}`} className="h-14 bg-white dark:bg-zinc-900 rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-accent" value={opt} onChange={e => {
                                                        const qus = [...newQuiz.questions];
                                                        qus[qidx].options[oidx] = e.target.value;
                                                        setNewQuiz({...newQuiz, questions: qus});
                                                    }} />
                                                ))}
                                            </div>
                                            <input placeholder="Correct Answer (Exact Match)" className="h-14 bg-accent/10 text-accent rounded-xl px-4 font-black outline-none border border-accent/20" value={q.correctAnswer} onChange={e => {
                                                const qus = [...newQuiz.questions];
                                                qus[qidx].correctAnswer = e.target.value;
                                                setNewQuiz({...newQuiz, questions: qus});
                                            }} />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-zinc-100 dark:border-zinc-800">
                                    <Button variant="ghost" onClick={handleAddQuestion} className="font-black uppercase tracking-widest text-[10px] gap-2"><Plus className="w-4 h-4" /> Add Question</Button>
                                    <div className="flex gap-4">
                                        <Button variant="ghost" onClick={() => setIsCreating(false)} className="font-black px-8">Discard</Button>
                                        <Button onClick={handleCreateQuiz} className="bg-accent text-white px-12 h-14 rounded-2xl font-black shadow-xl shadow-accent/20">Conduct Quiz</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Fixed Other Games Section */}
               <div className="p-10 bg-indigo-500 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10">
                       <Brain className="w-12 h-12 mb-6" />
                       <h3 className="text-2xl font-black mb-2">Vedic Puzzles</h3>
                       <p className="opacity-60 text-sm font-medium mb-8">Conduct sloka tile challenges and Sanskrit flip cards.</p>
                       <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-black h-12 rounded-xl border">Configure Puzzles</Button>
                   </div>
                   <Sparkles className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform" />
               </div>

               <div className="p-10 bg-rose-500 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10">
                       <Timer className="w-12 h-12 mb-6" />
                       <h3 className="text-2xl font-black mb-2">History Quest</h3>
                       <p className="opacity-60 text-sm font-medium mb-8">Set up interactive timelines and divine destiny quests.</p>
                       <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-black h-12 rounded-xl border">Manage Events</Button>
                   </div>
                   <Ghost className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform" />
               </div>

               {/* Quiz List */}
               {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-accent" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Consulting Scribes...</p>
                    </div>
                ) : quizzes.map((q, i) => (
                    <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-zinc-900 p-8 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                    <Gamepad2 className="w-6 h-6" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${q.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {q.isActive ? 'Live' : 'Closed'}
                                </span>
                            </div>
                            <h3 className="text-xl font-black mb-2">{q.title}</h3>
                            <p className="text-xs text-foreground/40 font-medium line-clamp-2">{q.description || "A test of divine knowledge."}</p>
                        </div>
                        <div className="pt-8 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-8">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{q._count?.questions || 0} Questions</span>
                            <Button variant="ghost" className="text-red-500 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest">End Session</Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
