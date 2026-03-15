"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RefreshCcw, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CARDS = [
    { sanskrit: "Dharma", english: "Righteous Duty / Purpose" },
    { sanskrit: "Karma", english: "Action and its Consequences" },
    { sanskrit: "Bhakti", english: "Devotional Service / Love" },
    { sanskrit: "Jnana", english: "Transcendental Knowledge" },
    { sanskrit: "Moksha", english: "Liberation from Birth & Death" },
    { sanskrit: "Seva", english: "Selfless Service" }
];

export default function FlipCards() {
    const [current, setCurrent] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const next = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrent((current + 1) % CARDS.length), 150);
    };

    const prev = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrent((current - 1 + CARDS.length) % CARDS.length), 150);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl border border-zinc-100 dark:border-zinc-800 space-y-12 min-h-[500px] flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                    <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black">Smart <span className="text-rose-500 italic">Learning</span></h3>
                <p className="text-xs font-black uppercase tracking-widest opacity-40">Card {current + 1} of {CARDS.length} • Tap to Flip</p>
            </div>

            <div 
                className="w-full max-w-sm aspect-[4/5] perspective-1000 cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    className="relative w-full h-full preserve-3d"
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-rose-400 to-rose-600 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl border-4 border-white/20">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-8">Sanskrit Word</h4>
                        <p className="text-5xl font-black text-white tracking-tighter italic">{CARDS[current].sanskrit}</p>
                        <motion.div 
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mt-12 text-white/40"
                        >
                            <Sparkles className="w-8 h-8" />
                        </motion.div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-zinc-800 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl border-4 border-rose-500/20 rotate-y-180">
                        <div className="rotate-y-180">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500/40 mb-8">Meaning</h4>
                            <p className="text-4xl font-black text-foreground tracking-tight leading-tight">{CARDS[current].english}</p>
                            <div className="mt-12 p-3 bg-rose-500/10 rounded-full text-rose-500 flex items-center justify-center w-fit mx-auto">
                                <Zap className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="flex gap-6 w-full max-w-sm">
                <Button variant="ghost" onClick={(e) => { e.stopPropagation(); prev(); }} className="flex-1 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-black uppercase tracking-widest text-[10px] gap-2">
                    <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <Button variant="ghost" onClick={(e) => { e.stopPropagation(); next(); }} className="flex-1 h-14 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-rose-500/30">
                    Next Master <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
