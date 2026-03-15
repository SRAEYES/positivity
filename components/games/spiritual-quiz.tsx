"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle2, XCircle, Trophy, RefreshCcw, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SpiritualQuiz({ quizId }: { quizId?: number }) {
    const [questions, setQuestions] = useState<any[]>([]);
    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (quizId) fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            // Fetch the specific quiz with its full questions included
            const res = await fetch(`/api/admin/games/${quizId}`);
            if (!res.ok) throw new Error("Quiz not found");
            const quiz = await res.json();
            if (quiz && Array.isArray(quiz.questions)) {
                setQuestions(quiz.questions.map((q: any) => ({
                    ...q,
                    options: JSON.parse(q.options)
                })));
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleAnswer = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        
        // Correct answer check logic
        const correctOptIdx = questions[step].options.indexOf(questions[step].correctAnswer);
        if (idx === correctOptIdx) setScore(score + 1);
        
        setTimeout(() => {
            if (step < questions.length - 1) {
                setStep(step + 1);
                setSelected(null);
            } else {
                setFinished(true);
            }
        }, 1500);
    };

    if (loading) return <Loader2 className="animate-spin text-primary" />;
    if (questions.length === 0) return <p className="text-zinc-400 italic">No guidance found in this scroll.</p>;

    return (
        <div className="bg-white rounded-[3rem] p-4 md:p-10 min-h-[500px] flex flex-col justify-center w-full max-w-2xl">
            <AnimatePresence mode="wait">
                {!finished ? (
                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                        <div className="flex justify-between items-center">
                            <div className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">Question {step + 1}/{questions.length}</div>
                            <div className="text-[10px] font-black opacity-30 uppercase tracking-widest">Score: {score}</div>
                        </div>

                        <h3 className="text-3xl font-black tracking-tight leading-tight">{questions[step].text}</h3>

                        <div className="grid grid-cols-1 gap-4">
                            {questions[step].options.map((opt: string, i: number) => {
                                const isCorrect = opt === questions[step].correctAnswer;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(i)}
                                        className={`p-6 rounded-2xl text-left font-bold transition-all flex justify-between items-center ${
                                            selected === i 
                                                ? (isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white')
                                                : (selected !== null && isCorrect ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-100 hover:bg-zinc-200')
                                        }`}
                                    >
                                        {opt}
                                        {selected === i && (isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />)}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto"><Trophy className="w-12 h-12 text-primary" /></div>
                        <h2 className="text-4xl font-black">Quest Complete!</h2>
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">You revealed {score}/{questions.length} eternal truths</p>
                        <Button className="h-16 px-12 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => window.location.reload()}>Finish Journey</Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
