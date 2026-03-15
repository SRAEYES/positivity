"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Gamepad2, Zap, LayoutDashboard, Sparkles, 
  ChevronLeft, ArrowLeft, Trophy, Target, Award,
  Flame, BookOpen, Heart, Activity, X, ArrowRight, Brain, Timer, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SpiritualQuiz from "@/components/games/spiritual-quiz";
import VedicPuzzles from "@/components/games/vedic-puzzles";
import DivineBowl from "@/components/games/divine-bowl";
import FlipCards from "@/components/games/flip-cards";
import DivineStack from "@/components/games/DivineStack";

export default function SpiritualArena() {
  const router = useRouter();
  const [activeGame, setActiveGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [arenaData, setArenaData] = useState<any>({ quizzes: [], puzzles: [], quests: [] });

  useEffect(() => {
    fetchArenaData();
  }, []);

  const fetchArenaData = async () => {
    try {
      const res = await fetch("/api/arena/games");
      const data = await res.json();
      setArenaData(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const games = [
    { 
        title: "Wisdom Quizzes", 
        icon: <Star className="w-8 h-8" />, 
        color: "bg-amber-500", 
        desc: "Interactive tests of Gita", 
        type: "quiz_list"
    },
    { 
        title: "Vedic Puzzles", 
        icon: <Brain className="w-8 h-8" />, 
        color: "bg-secondary", 
        desc: "Assemble the sacred sounds",
        type: "puzzle_list"
    },
    { 
        title: "Divine Bowl", 
        icon: <Sparkles className="w-8 h-8" />, 
        color: "bg-emerald-500", 
        desc: "Pick thy daily blessing",
        type: "bowl"
    },
    { 
        title: "Smart Cards", 
        icon: <Zap className="w-8 h-8" />, 
        color: "bg-rose-500", 
        desc: "Learn Sanskrit vocabulary",
        type: "cards"
    },
    { 
        title: "Divine Stack", 
        icon: <LayoutDashboard className="w-8 h-8" />, 
        color: "bg-indigo-500", 
        desc: "Explore the Divine Pantheon",
        type: "stack"
    },
    { 
        title: "History Quests", 
        icon: <Timer className="w-8 h-8" />, 
        color: "bg-amber-600", 
        desc: "Relive Sacred History",
        type: "quest_list"
    }
  ];

  if (loading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-8">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Opening the Gates...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-primary/20 selection:text-primary">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 pt-28 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => activeGame ? setActiveGame(null) : router.back()}
            className="group flex items-center gap-3 px-6 py-3 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-black text-[10px] uppercase tracking-widest text-zinc-400"
          >
            <ArrowLeft className="w-4 h-4 group-hover:text-primary transition-colors" /> 
            {activeGame ? "Exit Arena" : "Return to Temple"}
          </motion.button>

          <div className="text-center">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                <Trophy className="w-3.5 h-3.5 shadow-sm" /> Divine Play Zone
             </motion.div>
             <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2 italic">Spiritual <span className="text-secondary italic">Arena</span></h1>
          </div>

          <div className="flex items-center gap-4 text-right">
              <div>
                  <p className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">Available Quests</p>
                  <p className="text-xl font-black text-secondary">
                    {(arenaData?.quizzes?.length || 0) + (arenaData?.puzzles?.length || 0)} Challenges
                  </p>
              </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeGame ? (
            <motion.div key="active-view" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-[3rem] p-6 md:p-14 shadow-[0_32px_128px_rgba(0,0,0,0.06)] border border-zinc-50 relative">
              <button onClick={() => setActiveGame(null)} className="absolute top-8 right-8 w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 hover:bg-red-50 hover:text-red-500 transition-all z-20"><X className="w-6 h-6" /></button>

              <div className="mb-12 text-center">
                  <h2 className="text-4xl font-black italic tracking-tight text-primary">{activeGame.title}</h2>
                  <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-2">Active Soul Quest</p>
              </div>

              {activeGame.type === "quiz_list" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {arenaData?.quizzes?.map((q: any) => (
                          <div key={q.id} className="p-10 bg-zinc-50 rounded-[3rem] border border-zinc-100 flex items-center justify-between group hover:border-primary transition-all cursor-pointer" onClick={() => setActiveGame({ ...q, type: "active_quiz" })}>
                              <div>
                                  <h4 className="text-2xl font-black italic">{q.title}</h4>
                                  <p className="text-zinc-400 text-xs mt-1">{q._count?.questions} Questions</p>
                              </div>
                              <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                      ))}
                  </div>
              )}

              {activeGame.type === "puzzle_list" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {arenaData?.puzzles?.map((p: any) => (
                          <div key={p.id} className="p-10 bg-zinc-50 rounded-[3rem] border border-zinc-100 flex items-center justify-between group hover:border-primary transition-all cursor-pointer" onClick={() => setActiveGame({ ...p, type: "active_puzzle" })}>
                              <div>
                                  <h4 className="text-2xl font-black italic">{p.title}</h4>
                                  <p className="text-zinc-400 text-xs mt-1">{JSON.parse(p.tiles).length} Word Tiles</p>
                              </div>
                              <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                      ))}
                  </div>
              )}

              {activeGame.type === "quest_list" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {arenaData?.quests?.map((q: any) => (
                          <div key={q.id} className="p-10 bg-zinc-50 rounded-[3rem] border border-zinc-100 flex items-center justify-between group hover:border-primary transition-all cursor-pointer" onClick={() => setActiveGame({ ...q, type: "active_quest" })}>
                              <div>
                                  <h4 className="text-2xl font-black italic">{q.title}</h4>
                                  <p className="text-zinc-400 text-xs mt-1">{JSON.parse(q.events).length} Historical Events</p>
                              </div>
                              <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                      ))}
                  </div>
              )}

              <div className="min-h-[500px] flex items-center justify-center">
                {activeGame.type === "active_quiz" && <SpiritualQuiz quizId={activeGame.id} />}
                {activeGame.type === "active_puzzle" && <VedicPuzzles puzzleId={activeGame.id} />}
                {activeGame.type === "active_quest" && (
                    <div className="w-full max-w-2xl space-y-8">
                        {/* Simple list view for now */}
                        {JSON.parse(activeGame.events).map((e: any, i: number) => (
                            <div key={i} className="flex gap-6 p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
                                <div className="text-2xl font-black text-primary">{e.year}</div>
                                <div>
                                    <h4 className="text-xl font-bold">{e.title}</h4>
                                    <p className="text-zinc-500 text-sm mt-1">{e.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeGame.type === "bowl" && <DivineBowl />}
                {activeGame.type === "cards" && <FlipCards />}
                {activeGame.type === "stack" && <DivineStack />}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {games.map((game, idx) => (
                      <motion.div key={game.title} whileHover={{ y: -10 }} onClick={() => setActiveGame(game)} className="bg-white rounded-[4rem] p-10 border border-zinc-50 shadow-xl cursor-pointer group relative overflow-hidden transition-all">
                          <div className={`w-20 h-20 ${game.color} rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:rotate-12 transition-transform duration-500`}>{game.icon}</div>
                          <h3 className="text-3xl font-black italic tracking-tighter uppercase text-zinc-900 mb-2">{game.title}</h3>
                          <p className="text-xs font-medium text-zinc-400 italic mb-6 leading-relaxed">{game.desc}</p>
                          <div className="text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">Enter Code <ArrowRight className="inline-block ml-1 w-3 h-3" /></div>
                      </motion.div>
                  ))}
              </div>

              {/* Restore Upcoming Games */}
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic text-zinc-300">Upcoming <span className="text-primary italic">Revelations</span></h2>
                    <div className="h-[1px] flex-1 bg-zinc-100" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: "Vedic Hunt", icon: <Target className="w-6 h-6" />, desc: "Find the hidden slokas" },
                      { title: "Karma Runner", icon: <Activity className="w-6 h-6" />, desc: "Balance the scales" },
                      { title: "Soul Voyage", icon: <Heart className="w-6 h-6" />, desc: "Journey through realms" },
                    ].map((game) => (
                        <div key={game.title} className="bg-white border border-dashed border-zinc-200 rounded-[3rem] p-8 flex items-center gap-6 opacity-40 group grayscale">
                             <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                                 {game.icon}
                             </div>
                             <div className="space-y-0.5">
                                 <h4 className="text-lg font-black tracking-tight text-zinc-800">{game.title}</h4>
                                 <p className="text-[10px] font-bold italic text-zinc-300 uppercase tracking-widest">Release Soon</p>
                             </div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
