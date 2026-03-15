"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, RefreshCw } from "lucide-react";

const DEITIES = [
  {
    id: 1,
    name: "Sri Krishna",
    info: "The Supreme Personality of Godhead, Lord of the Universe and speaker of the Bhagavad Gita.",
    image: "https://vms9.com/wp-content/uploads/2024/08/lord-krishna-images-hd-wallpaper-vms9-9.jpg",
    color: "from-blue-600 to-indigo-900"
  },
  {
    id: 2,
    name: "Sri Rama",
    info: "The Ideal King and embodiment of Dharma. Savior of Janaki and Lord of Ayodhya.",
    image: "https://images.unsplash.com/photo-1614032151610-3367b9605658?auto=format&fit=crop&q=80&w=400",
    color: "from-orange-500 to-red-700"
  },
  {
    id: 3,
    name: "Lord Shiva",
    info: "The auspicious Mahadeva, Lord of Yogis and the source of the holy Ganges.",
    image: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&q=80&w=400",
    color: "from-cyan-900 to-zinc-950"
  },
  {
    id: 4,
    name: "Srimati Radharani",
    info: "The embodiment of Hladini Shakti and the supreme devotee of Lord Sri Krishna.",
    image: "https://i.pinimg.com/736x/8f/7d/5a/8f7d5af8369689e478546199a6c9d81d.jpg",
    color: "from-rose-400 to-pink-600"
  },
  {
    id: 5,
    name: "Narasimha Deva",
    info: "The Half-Man Half-Lion incarnation of Lord Vishnu who protected Prahlada Maharaja.",
    image: "https://m.media-amazon.com/images/I/71YyP9f8L8L._AC_UF1000,1000_QL80_.jpg",
    color: "from-amber-600 to-red-900"
  }
];

export default function DivineStack() {
  const [stack, setStack] = useState(DEITIES);

  const moveToEnd = () => {
    const newStack = [...stack];
    const top = newStack.shift()!;
    newStack.push(top);
    setStack(newStack);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl border border-zinc-100 dark:border-zinc-800 space-y-10 min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-3xl font-black">Divine <span className="text-primary italic">Stack</span></h3>
        <p className="text-xs font-black uppercase tracking-widest opacity-40 italic">Tap cards to unveil the Pantheon</p>
      </div>

      <div className="relative w-72 h-[450px] mt-10">
        <AnimatePresence>
          {stack.slice(0, 3).reverse().map((deity, index) => {
            const isTop = index === 2; // slice(0,3).reverse() makes index 2 the top card
            return (
              <motion.div
                key={deity.id}
                layout
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ 
                  scale: 0.8 + (index * 0.1), 
                  opacity: 1, 
                  y: -index * 20,
                  zIndex: index,
                  filter: isTop ? "blur(0px)" : `blur(${4 - index * 2}px)`
                }}
                exit={{ x: 300, opacity: 0, rotate: 20 }}
                onClick={isTop ? moveToEnd : undefined}
                className={`absolute inset-0 bg-white dark:bg-zinc-800 rounded-[2.5rem] shadow-2xl border-4 border-zinc-100 dark:border-zinc-700 overflow-hidden cursor-pointer group transition-transform`}
              >
                <div className={`h-1/2 bg-gradient-to-br ${deity.color} relative`}>
                    <img 
                      src={deity.image} 
                      alt={deity.name}
                      className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-zinc-800 to-transparent"></div>
                </div>
                
                <div className="p-8 space-y-4 flex flex-col h-1/2 justify-between">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black tracking-tight">{deity.name}</h4>
                    <p className="text-[10px] font-medium text-foreground/60 leading-relaxed italic">
                      {deity.info}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary">
                    <Info className="w-3 h-3" /> Tap to cycle
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button 
        onClick={() => setStack([...DEITIES])}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-all mt-10"
      >
        <RefreshCw className="w-3 h-3" /> Reset Divine Order
      </button>
    </div>
  );
}
