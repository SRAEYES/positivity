"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle2, XCircle, Trophy, RefreshCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUESTIONS = [
    {
        q: "Who is the speaker of the Bhagavad Gita?",
        options: ["Arjuna", "Krishna", "Vyasa", "Sanjaya"],
        a: 1
    },
    {
        q: "How many chapters are in the Bhagavad Gita?",
        options: ["10", "12", "18", "24"],
        a: 2
    },
    {
        q: "What does the word 'Yoga' literally mean?",
        options: ["Exercise", "Union", "Stretching", "Silence"],
        a: 1
    },
    {
        q: "Which Veda is the oldest?",
        options: ["Sama Veda", "Yajur Veda", "Atharva Veda", "Rig Veda"],
        a: 3
    }
];

export default function SpiritualQuiz() {
    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const handleAnswer = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        if (idx === QUESTIONS[step].a) setScore(score + 1);
        
        setTimeout(() => {
            if (step < QUESTIONS.length - 1) {
                setStep(step + 1);
                setSelected(null);
            } else {
                setFinished(true);
            }
        }, 1500);
    };

    const reset = () => {
        setStep(0);
        setSelected(null);
        setScore(0);
        setFinished(false);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl border border-zinc-100 dark:border-zinc-800 min-h-[500px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
                {!finished ? (
                    <motion.div 
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                        <div className="flex justify-between items-center">
                            <div className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">Question {step + 1}/{QUESTIONS.length}</div>
                            <div className="text-[10px] font-black opacity-30 uppercase tracking-widest">Score: {score}</div>
                        </div>

                        <h3 className="text-3xl font-black tracking-tight leading-tight">{QUESTIONS[step].q}</h3>

                        <div className="grid grid-cols-1 gap-4">
                            {QUESTIONS[step].options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(i)}
                                    className={`p-6 rounded-2xl text-left font-bold transition-all flex justify-between items-center ${
                                        selected === i 
                                            ? (i === QUESTIONS[step].a ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white')
                                            : (selected !== null && i === QUESTIONS[step].a ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700')
                                    }`}
                                >
                                    {opt}
                                    {selected === i && (i === QUESTIONS[step].a ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />)}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8"
                    >
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                            <Trophy className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-4xl font-black">Sacred Accomplishment!</h2>
                        <p className="text-foreground/40 font-bold uppercase tracking-widest">You scored {score}/{QUESTIONS.length} realizations</p>
                        
                        <div className="pt-10 flex gap-4">
                            <Button onClick={reset} variant="outline" className="flex-1 h-14 rounded-2xl font-black tracking-widest uppercase text-xs">Try Again <RefreshCcw className="ml-2 w-4 h-4" /></Button>
                            <Button className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl shadow-primary/20">Claim Reward <ArrowRight className="ml-2 w-4 h-4" /></Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
