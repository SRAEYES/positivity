"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, RefreshCw, Loader2 } from "lucide-react";

// Default deities as fallback if API is empty
const DEFAULT_DEITIES = [
  { id: 1, name: "Sri Krishna", info: "The Supreme Personality of Godhead, speaker of the Bhagavad Gita and Lord of Dwarka.", image: "https://images.unsplash.com/photo-1609619385002-f40f1df66e12?w=400", color: "from-blue-600 to-indigo-900" },
  { id: 2, name: "Sri Rama", info: "The ideal King and embodiment of Dharma. Avatar of Vishnu and Lord of Ayodhya.", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400", color: "from-orange-500 to-red-700" },
  { id: 3, name: "Lord Shiva", info: "The auspicious Mahadeva, Lord of Yogis and destroyer of all illusion.", image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400", color: "from-cyan-900 to-zinc-950" },
  { id: 4, name: "Srimati Radharani", info: "The embodiment of divine love and the supreme devotee of Lord Sri Krishna.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", color: "from-rose-400 to-pink-600" },
  { id: 5, name: "Narasimha Deva", info: "The half-man, half-lion avatar of Vishnu who protected the devotee Prahlada.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400", color: "from-amber-600 to-red-900" },
];

interface DivineStackProps {
  deities?: any[]; // Can be passed from parent (arena) if already fetched
}

export default function DivineStack({ deities: propDeities }: DivineStackProps) {
  const [deities, setDeities] = useState<any[]>([]);
  const [stack, setStack] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propDeities && propDeities.length > 0) {
      setDeities(propDeities);
      setStack(propDeities);
      setLoading(false);
    } else {
      fetchDeities();
    }
  }, [propDeities]);

  const fetchDeities = async () => {
    try {
      const res = await fetch("/api/admin/games/deities");
      const data = await res.json();
      const list = Array.isArray(data) && data.length > 0 ? data : DEFAULT_DEITIES;
      setDeities(list);
      setStack(list);
    } catch {
      setDeities(DEFAULT_DEITIES);
      setStack(DEFAULT_DEITIES);
    } finally {
      setLoading(false);
    }
  };

  const moveToEnd = () => {
    const newStack = [...stack];
    const top = newStack.shift()!;
    newStack.push(top);
    setStack(newStack);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-primary w-8 h-8" />
    </div>
  );

  return (
    <div className="bg-white rounded-[3rem] p-6 md:p-10 shadow-xl border border-zinc-100 space-y-8 min-h-[560px] flex flex-col items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto">
          <Sparkles className="w-7 h-7 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-black">Divine <span className="text-indigo-600 italic">Stack</span></h3>
        <p className="text-xs font-black uppercase tracking-widest text-foreground/40 italic">Tap card to explore the Pantheon</p>
      </div>

      <div className="relative w-72 h-[400px]">
        <AnimatePresence>
          {stack.slice(0, 3).reverse().map((deity, index) => {
            const isTop = index === 2;
            return (
              <motion.div
                key={deity.id}
                layout
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{
                  scale: 0.82 + (index * 0.09),
                  opacity: 1,
                  y: -index * 18,
                  zIndex: index,
                  filter: isTop ? "blur(0px)" : `blur(${(2 - index) * 1.5}px)`
                }}
                exit={{ x: 300, opacity: 0, rotate: 20 }}
                onClick={isTop ? moveToEnd : undefined}
                className="absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl border-2 border-zinc-100 overflow-hidden cursor-pointer"
              >
                <div className={`h-[55%] bg-gradient-to-br ${deity.color} relative`}>
                  <img
                    src={deity.image}
                    alt={deity.name}
                    className="w-full h-full object-cover opacity-70 mix-blend-overlay"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="p-6 space-y-3 flex flex-col h-[45%] justify-between">
                  <div>
                    <h4 className="text-xl font-black tracking-tight">{deity.name}</h4>
                    <p className="text-xs font-medium text-foreground/60 leading-relaxed italic mt-1">{deity.info}</p>
                  </div>
                  {isTop && (
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-500">
                      <Info className="w-3 h-3" /> Tap to cycle
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6 mt-4">
        <button onClick={() => setStack([...deities])} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground/70 transition-all">
          <RefreshCw className="w-3 h-3" /> Reset Divine Order
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{stack.length} Deities</span>
      </div>
    </div>
  );
}
