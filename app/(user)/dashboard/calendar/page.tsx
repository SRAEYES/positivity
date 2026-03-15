"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sun, Star, Moon, Calendar as CalendarIcon } from "lucide-react";

const FESTIVALS = [
  { date: "2026-03-14", name: "Ekadashi (Papamochani)", type: "fast", importance: "high" },
  { date: "2026-03-25", name: "Gaura Purnima", type: "festival", importance: "high" },
  { date: "2026-04-10", name: "Rama Navami", type: "festival", importance: "high" },
  { date: "2026-04-20", name: "Ekadashi (Kamada)", type: "fast", importance: "medium" },
  { date: "2026-05-10", name: "Narasimha Chaturdashi", type: "festival", importance: "high" },
];

export default function SpiritualCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const days = Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1);
  const offset = firstDayOfMonth(month, year);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter">Spiritual <span className="text-primary italic">Calendar</span></h1>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Align with the Divine Flow</p>
          </div>
          <div className="flex gap-4">
             <button onClick={prevMonth} className="p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-lg hover:shadow-primary/10 transition-all border border-zinc-100 dark:border-zinc-800"><ChevronLeft className="w-5 h-5" /></button>
             <button onClick={nextMonth} className="p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-lg hover:shadow-primary/10 transition-all border border-zinc-100 dark:border-zinc-800"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-3xl border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
          <CalendarIcon className="absolute -top-10 -right-10 w-60 h-60 opacity-[0.03] dark:opacity-[0.05] -rotate-12" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-10 text-primary uppercase tracking-tighter">
                {currentDate.toLocaleString('default', { month: 'long' })} {year}
            </h2>

            <div className="grid grid-cols-7 gap-4 mb-8">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest opacity-30">{d}</div>
              ))}
              
              {Array(offset).fill(null).map((_, i) => (
                <div key={`offset-${i}`} className="aspect-square" />
              ))}
              
              {days.map(d => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const festival = FESTIVALS.find(f => f.date === dateStr);
                const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
                
                return (
                  <motion.div 
                    key={d}
                    whileHover={{ scale: 1.1 }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative border transition-all ${
                        isToday ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : 
                        festival ? "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50" : 
                        "bg-zinc-50 dark:bg-zinc-800/50 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                    }`}
                  >
                    <span className={`text-sm font-black ${isToday ? "" : "opacity-60"}`}>{d}</span>
                    {festival && (
                        <div className={`w-1.5 h-1.5 rounded-full absolute bottom-2 ${festival.type === 'fast' ? "bg-rose-500" : "bg-emerald-500"} animate-pulse`} />
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Auspicious Dates this Month</h4>
                 <div className="grid md:grid-cols-2 gap-4">
                    {FESTIVALS.filter(f => {
                        const fDate = new Date(f.date);
                        return fDate.getMonth() === month && fDate.getFullYear() === year;
                    }).map(f => (
                        <div key={f.name} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.type === 'fast' ? "bg-rose-100 text-rose-500" : "bg-emerald-100 text-emerald-500"}`}>
                                {f.type === 'fast' ? <Moon className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                             </div>
                             <div>
                                <h5 className="text-xs font-black">{f.name}</h5>
                                <p className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">{new Date(f.date).toLocaleDateString('default', { day: 'numeric', month: 'short' })}</p>
                             </div>
                        </div>
                    ))}
                    {FESTIVALS.filter(f => {
                        const fDate = new Date(f.date);
                        return fDate.getMonth() === month && fDate.getFullYear() === year;
                    }).length === 0 && (
                        <p className="text-xs italic opacity-30">No major festivals noted for this moon cycle...</p>
                    )}
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
