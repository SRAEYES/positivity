"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, AlertCircle, Loader2, ChevronLeft, Save, Sparkles, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminExams() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  
  // New Exam Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([
    { text: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);
  const [saving, setSaving] = useState(false);

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/admin/exams");
      const data = await res.json();
      setExams(data.quizzes || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchExams(); }, []);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, questions })
      });
      if (res.ok) {
        setShowCreate(false);
        fetchExams();
        setTitle("");
        setDescription("");
        setQuestions([{ text: "", options: ["", "", "", ""], correctAnswer: "" }]);
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const deleteExam = async (id: number) => {
    if (!confirm("Are you sure you want to dissolve this exam?")) return;
    try {
      const res = await fetch(`/api/admin/exams?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchExams();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-1">
            <button 
              onClick={() => router.push("/admin/dashboard")}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mb-4"
            >
              <ChevronLeft className="w-3 h-3" /> Back to Insight
            </button>
            <h1 className="text-4xl font-black tracking-tighter">Divine <span className="text-accent italic">Exams</span></h1>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Measure the Depth of Understanding</p>
          </div>

          <Button 
            onClick={() => setShowCreate(true)}
            className="h-16 px-10 bg-accent text-white rounded-2xl font-black shadow-xl shadow-accent/20 transition-all gap-3"
          >
            <Plus className="w-5 h-5" /> Manifest New Exam
          </Button>
        </header>

        {loading ? (
             <div className="flex items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {exams.map((exam) => (
                    <motion.div 
                        key={exam.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl group relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <button onClick={() => deleteExam(exam.id)} className="p-2 text-foreground/20 hover:text-rose-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="text-xl font-black mb-2 tracking-tight">{exam.title}</h3>
                        <p className="text-xs font-medium opacity-40 line-clamp-2 mb-6">{exam.description || "Testing the sacred knowledge of seekers."}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-800">
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                                <Sparkles className="w-3 h-3 text-accent" />
                                {exam.questions?.length || 0} Questions
                             </div>
                             <span className="text-[8px] font-black px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg opacity-40">ID: {exam.id}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}

        {/* Create Modal overlay UI */}
        <AnimatePresence>
            {showCreate && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-12">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="bg-white dark:bg-zinc-950 w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] shadow-3xl overflow-hidden flex flex-col"
                    >
                        <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter">Manifest <span className="text-accent italic">Exam</span></h2>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Structuralize Divine Knowledge</p>
                            </div>
                            <button onClick={() => setShowCreate(false)} className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                           <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Exam Title</Label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Bhagavad Gita Chapter 1 Quiz" className="h-14 bg-zinc-50 dark:bg-zinc-900 border-transparent rounded-2xl px-6 font-bold" required />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Description</Label>
                                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter sacred context..." className="h-14 bg-zinc-50 dark:bg-zinc-900 border-transparent rounded-2xl px-6 font-bold" />
                                </div>
                           </div>

                           <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black tracking-tight">Vedic Questions</h3>
                                    <button type="button" onClick={addQuestion} className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2 hover:translate-x-1 transition-transform">
                                        <Plus className="w-4 h-4" /> Add Question
                                    </button>
                                </div>

                                <div className="space-y-12">
                                    {questions.map((q, qIndex) => (
                                        <div key={qIndex} className="p-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 space-y-6 relative">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-black text-xs">{qIndex + 1}</span>
                                                <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))} className="text-rose-500/40 hover:text-rose-500 transition-all font-black uppercase text-[8px] tracking-widest">Dissolve Question</button>
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Question Text</Label>
                                                <textarea 
                                                    value={q.text} 
                                                    onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                                                    className="w-full h-32 bg-white dark:bg-zinc-950 border-transparent rounded-2xl p-6 font-bold resize-none focus:ring-2 ring-accent/20 outline-none"
                                                    placeholder="Enter thy question here..."
                                                    required
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {q.options.map((opt: string, oIndex: number) => (
                                                    <div key={oIndex} className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-2">Option {String.fromCharCode(65 + oIndex)}</Label>
                                                        <div className="flex items-center gap-3">
                                                            <Input 
                                                                value={opt} 
                                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                                className={`h-12 bg-white dark:bg-zinc-950 border-2 rounded-xl px-4 font-bold ${q.correctAnswer === opt && opt !== "" ? "border-emerald-500/50" : "border-transparent"}`}
                                                                placeholder={`Choice ${oIndex + 1}`}
                                                                required
                                                            />
                                                            <button 
                                                                type="button" 
                                                                onClick={() => updateQuestion(qIndex, "correctAnswer", opt)}
                                                                disabled={!opt}
                                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${q.correctAnswer === opt && opt !== "" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40" : "bg-zinc-100 dark:bg-zinc-800 text-foreground/20 hover:text-emerald-500"}`}
                                                            >
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                           </div>
                        </form>

                        <div className="p-10 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex gap-6">
                             <Button onClick={() => setShowCreate(false)} variant="outline" className="h-16 flex-1 rounded-[1.5rem] font-black uppercase tracking-widest text-xs">
                                Abandon Manifestation
                             </Button>
                             <Button onClick={handleSubmit} disabled={saving || !title || questions.some(q => !q.text || !q.correctAnswer)} className="h-16 flex-[2] rounded-[1.5rem] bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-accent/20">
                                {saving ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-3"><Save className="w-5 h-5" /> Seal & Manifest Exam</span>}
                             </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function X({ className }: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    )
}
