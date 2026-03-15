"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, CheckCircle2, RefreshCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PUZZLE_DATA = [
    {
        id: 1,
        full: "Hare Krishna Hare Krishna Krishna Krishna Hare Hare Hare Rama Hare Rama Rama Rama Hare Hare",
        tiles: ["Hare Krishna", "Hare Krishna", "Krishna Krishna", "Hare Hare", "Hare Rama", "Hare Rama", "Rama Rama", "Hare Hare"]
    },
    {
        id: 2,
        full: "Jaya Sri Krishna Chaitanya Prabhu Nityananda Sri Advaita Gadadhara Srivasadi Gaura Bhakta Vrinda",
        tiles: ["Jaya Sri Krishna", "Chaitanya", "Prabhu Nityananda", "Sri Advaita", "Gadadhara", "Srivasadi", "Gaura Bhakta", "Vrinda"]
    }
];

export default function VedicPuzzles() {
    const [current, setCurrent] = useState(0);
    const [shuffled, setShuffled] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        const item = PUZZLE_DATA[current];
        setShuffled([...item.tiles].sort(() => Math.random() - 0.5));
        setSelected([]);
        setIsCorrect(false);
    }, [current]);

    const handleTileClick = (tile: string, idx: number) => {
        const newSelected = [...selected, tile];
        setSelected(newSelected);
        
        const remaining = [...shuffled];
        remaining.splice(idx, 1);
        setShuffled(remaining);

        if (newSelected.length === PUZZLE_DATA[current].tiles.length) {
            if (newSelected.join(" ") === PUZZLE_DATA[current].tiles.join(" ")) {
                setIsCorrect(true);
            }
        }
    };

    const reset = () => {
        const item = PUZZLE_DATA[current];
        setShuffled([...item.tiles].sort(() => Math.random() - 0.5));
        setSelected([]);
        setIsCorrect(false);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl border border-zinc-100 dark:border-zinc-800 space-y-10 min-h-[500px] flex flex-col justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Puzzle className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-3xl font-black">Arrange the <span className="text-indigo-500 italic">Sacred Sound</span></h3>
                <p className="text-xs font-black uppercase tracking-widest opacity-40">Quest {current + 1} of {PUZZLE_DATA.length}</p>
            </div>

            <div className="space-y-6">
                <div className="flex flex-wrap gap-3 p-8 bg-zinc-50 dark:bg-zinc-950 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 min-h-[140px] items-center justify-center">
                    <AnimatePresence>
                        {selected.map((tile, i) => (
                            <motion.div
                                key={`selected-${i}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-500/20"
                            >
                                {tile}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {selected.length === 0 && <span className="text-foreground/20 font-black uppercase text-[10px] tracking-[0.2em]">Select tiles in order</span>}
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                    <AnimatePresence>
                        {shuffled.map((tile, i) => (
                            <motion.button
                                key={`tile-${tile}-${i}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                onClick={() => handleTileClick(tile, i)}
                                className="px-6 py-4 bg-white dark:bg-zinc-800 rounded-xl font-bold border-2 border-zinc-100 dark:border-zinc-700 hover:border-indigo-500 transition-all text-sm"
                            >
                                {tile}
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {isCorrect && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="flex items-center justify-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-xs">
                        <CheckCircle2 className="w-5 h-5" /> Divine Order Restored!
                    </div>
                    {current < PUZZLE_DATA.length - 1 ? (
                        <Button onClick={() => setCurrent(current + 1)} className="bg-indigo-500 hover:bg-indigo-600 text-white h-14 px-10 rounded-2xl font-black shadow-xl shadow-indigo-500/20">
                            Next Quest <Sparkles className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Button onClick={reset} variant="outline" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs">
                             Restart Path <RefreshCcw className="ml-2 w-4 h-4" />
                        </Button>
                    )}
                </motion.div>
            )}

            {!isCorrect && selected.length > 0 && selected.length === PUZZLE_DATA[current].tiles.length && (
                <div className="text-center space-y-4">
                    <p className="text-rose-500 font-black uppercase tracking-widest text-[10px]">The sounds are out of alignment...</p>
                    <Button onClick={reset} variant="ghost" className="text-indigo-500 font-black uppercase text-[10px] tracking-widest">Try Again</Button>
                </div>
            )}
        </div>
    );
}
