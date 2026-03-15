"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCcw, Gift, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const BLESSINGS = [
    "You will find deep peace in meditation today.",
    "A new spiritual door is about to open for you.",
    "Thy service has been noticed by the Devotees.",
    "Strength will find you in your morning rounds.",
    "Wisdom awaits in the next sloka you read.",
    "Radha's mercy is showering upon thee."
];

export default function DivineBowl() {
    const [picking, setPicking] = useState(false);
    const [blessing, setBlessing] = useState<string | null>(null);

    const pick = () => {
        setPicking(true);
        setBlessing(null);
        setTimeout(() => {
            setBlessing(BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)]);
            setPicking(false);
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl border border-zinc-100 dark:border-zinc-800 space-y-12 min-h-[500px] flex flex-col items-center justify-center text-center">
            <div className="space-y-4">
                <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-3xl font-black">The <span className="text-rose-500 italic">Sacred Bowl</span></h3>
                <p className="text-xs font-black uppercase tracking-widest opacity-40">Dip into the mystery of the hour</p>
            </div>

            <div className="relative">
                <motion.div
                    animate={picking ? { rotate: [0, -5, 5, -5, 0], scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: picking ? Infinity : 0, duration: 0.5 }}
                    className="w-48 h-48 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full shadow-3xl flex items-center justify-center relative border-8 border-rose-300/30"
                >
                    <div className="absolute inset-4 rounded-full border-4 border-dashed border-white/20" />
                    <Gift className="w-20 h-20 text-white drop-shadow-2xl" />
                </motion.div>

                {picking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                         <div className="w-64 h-64 border-4 border-primary rounded-full animate-ping opacity-20" />
                    </motion.div>
                )}
            </div>

            <div className="min-h-[100px] flex items-center justify-center max-w-sm">
                <AnimatePresence mode="wait">
                    {blessing ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <p className="text-2xl font-black italic tracking-tight leading-relaxed">"{blessing}"</p>
                            <Button onClick={() => setBlessing(null)} variant="ghost" className="text-rose-500 font-black uppercase text-[10px] tracking-widest">Dip Again</Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Button
                                onClick={pick}
                                disabled={picking}
                                className="h-20 px-12 bg-rose-500 hover:bg-rose-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-rose-500/30 group gap-4 transition-all hover:scale-105 active:scale-95"
                            >
                                {picking ? "Stirring the Akasha..." : (
                                    <>Reach Inside <MousePointer2 className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
