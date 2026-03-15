"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap, Loader2 } from "lucide-react";

interface Card { id: number; sanskrit: string; english: string; example?: string | null; }

export default function FlipCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [current, setCurrent] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/games/smartcards")
      .then(r => r.json())
      .then((data: Card[]) => { setCards(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const go = (dir: 1 | -1) => {
    setIsFlipped(false);
    setTimeout(() => setCurrent((c) => (c + dir + cards.length) % cards.length), 150);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <Loader2 className="animate-spin text-rose-500 w-8 h-8" />
    </div>
  );

  if (cards.length === 0) return (
    <p className="text-center text-zinc-400 italic">No cards found. Ask admin to add some!</p>
  );

  const card = cards[current];

  return (
    <div className="w-full flex flex-col items-center gap-8 py-4 select-none">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-rose-500" />
          <h3 className="text-lg font-black tracking-tight">Smart Learning</h3>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Card {current + 1} of {cards.length} • Tap card to flip
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 flex-wrap justify-center max-w-xs">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIsFlipped(false); setTimeout(() => setCurrent(i), 150); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-rose-500" : "w-1.5 bg-zinc-200"}`}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          key={card.id}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.55, type: "spring", stiffness: 300, damping: 28 }}
          style={{ transformStyle: "preserve-3d", position: "relative" }}
          className="w-full"
        >
          {/* FRONT */}
          <div
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            className="w-full rounded-3xl bg-gradient-to-br from-rose-500 to-rose-600 p-10 flex flex-col items-center justify-center gap-6 min-h-[280px] shadow-2xl shadow-rose-500/30"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Sanskrit Word</span>
            <p className="text-6xl font-black text-white tracking-tight italic">{card.sanskrit}</p>
            <div className="mt-4 px-4 py-2 rounded-full bg-white/15 text-[10px] font-black uppercase tracking-widest text-white/70">
              Tap to reveal meaning →
            </div>
          </div>

          {/* BACK */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              position: "absolute",
              inset: 0,
            }}
            className="w-full rounded-3xl bg-white border-2 border-zinc-100 p-10 flex flex-col items-center justify-center gap-5 min-h-[280px] shadow-2xl"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-400">Meaning</span>
            <p className="text-3xl font-black text-zinc-900 tracking-tight text-center leading-snug">{card.english}</p>
            {card.example && (
              <>
                <div className="w-12 h-0.5 bg-zinc-100 rounded-full" />
                <p className="text-sm text-zinc-400 italic text-center leading-relaxed max-w-xs">"{card.example}"</p>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 w-full max-w-md">
        <button
          onClick={() => go(-1)}
          className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-zinc-100 hover:bg-zinc-200 font-black text-[11px] uppercase tracking-widest transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => go(1)}
          className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-rose-500/30 transition-all"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
