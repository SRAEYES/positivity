"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Sparkles, Sun, Star, ArrowRight, Heart, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        router.replace("/login");
        setChecked(true);
        setLoggedIn(false);
      } else {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setChecked(true);
        setLoggedIn(true);
      }
    }
  }, [router]);

  if (!checked || !loggedIn) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen pb-20">
      
      {/* Premium Spiritual Greeting Header */}
      <div className="relative overflow-hidden pt-20 pb-40 px-8">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-50 dark:from-orange-950/40 dark:via-zinc-900 dark:to-zinc-950 z-0"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48 z-10"></div>
        
        <div className="max-w-6xl mx-auto relative z-20 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center md:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-black mb-6 uppercase tracking-widest">
              <Sun className="w-4 h-4" />
              <span>Surya Namaskar</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-none">
              Namaste, <br />
              <span className="text-primary italic text-6xl md:text-8xl">{user?.name || "Seeker"}</span>.
            </motion.h1>
            <motion.div variants={itemVariants} className="max-w-xl p-8 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[2.5rem] shadow-xl">
              <p className="text-xl md:text-2xl font-serif italic text-foreground/80 leading-relaxed mb-4">
                "You are what your deep, driving desire is. As your desire is, so is your will. As your will is, so is your deed."
              </p>
              <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-tighter">
                <div className="w-8 h-[2px] bg-primary"></div>
                <span>Brihadaranyaka Upanishad</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden md:flex flex-col gap-6"
          >
            <div className="p-8 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 dark:border-white/10 shadow-2xl flex items-center gap-6">
               <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                  <Star className="text-white w-8 h-8 fill-current" />
               </div>
               <div>
                  <div className="text-xs font-black uppercase tracking-widest opacity-40">Sadhana Level</div>
                  <div className="text-3xl font-black text-primary">Advanced Seeker</div>
               </div>
            </div>
            
            <div className="p-8 bg-accent/90 backdrop-blur-3xl rounded-[3rem] text-white shadow-2xl flex items-center gap-6">
               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Zap className="text-white w-8 h-8 fill-current" />
               </div>
               <div>
                  <div className="text-xs font-black uppercase tracking-widest opacity-60">Insight Points</div>
                  <div className="text-3xl font-black">1,240</div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full px-6 -mt-24 relative z-30">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Explore Courses Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            onClick={() => router.push("/courses")}
            className="group cursor-pointer bg-white dark:bg-zinc-800 p-10 rounded-[3.5rem] shadow-2xl hover:shadow-primary/10 transition-all border border-transparent hover:border-primary/20 flex flex-col items-start min-h-[400px]"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-3xl mb-8 flex items-center justify-center group-hover:bg-primary transition-all duration-500">
              <BookOpen className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-foreground group-hover:text-primary transition-colors">
              Divine Wisdom
            </h2>
            <p className="text-foreground/60 mb-8 leading-relaxed text-lg">
              Unlock the secrets of the Vedas, Upanishads, and the Bhagavad Gita through our structured masterclasses.
            </p>
            <div className="mt-auto inline-flex items-center gap-3 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl font-black text-primary group-hover:bg-primary group-hover:text-white transition-all">
              Browse Wisdom <ArrowRight className="w-5 h-5" />
            </div>
          </motion.div>

          {/* My Courses Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            onClick={() => router.push("/dashboard/enrolled")}
            className="group cursor-pointer bg-white dark:bg-zinc-800 p-10 rounded-[3.5rem] shadow-2xl hover:shadow-secondary/20 transition-all border border-transparent hover:border-secondary/40 flex flex-col items-start min-h-[400px] glow-lotus"
          >
            <div className="w-20 h-20 bg-secondary/10 rounded-3xl mb-8 flex items-center justify-center group-hover:bg-secondary transition-all duration-500">
              <GraduationCap className="w-10 h-10 text-secondary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-3xl font-black mb-4 text-foreground group-hover:text-secondary transition-colors">
              Inner Journey
            </h2>
            <p className="text-foreground/60 mb-8 leading-relaxed text-lg">
              Continue your spiritual evolution. Access your ongoing courses, worksheets, and meditative practices.
            </p>
            <div className="mt-auto inline-flex items-center gap-3 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl font-black text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
              Resume Sadhana <ArrowRight className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Daily Goal / Sadhana Tracker */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-accent p-10 rounded-[3.5rem] shadow-2xl text-white flex flex-col min-h-[400px] relative overflow-hidden shadow-accent/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            
            <div className="w-16 h-16 bg-white/20 rounded-2xl mb-8 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-3xl font-black mb-4">Daily Sadhana</h2>
            <p className="opacity-80 mb-8 text-lg font-medium">
              Daily discipline is the key to liberation. Stay consistent with your practices.
            </p>
            
            <div className="space-y-4 mb-8">
               <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                  <div className="w-3 h-3 rounded-full bg-primary animate-ping"></div>
                  <span className="font-bold">Journey Progress: {user?.progress || 0}%</span>
               </div>
            </div>

            <button 
                onClick={async () => {
                   try {
                       const next = Math.min(100, (user?.progress || 0) + 5);
                       const res = await fetch("/api/enroll/progress", {
                           method: "POST",
                           body: JSON.stringify({ userId: user.id, courseId: 1, progress: next }) // Hardcoded for demo/first course
                       });
                       if (res.ok) {
                           const newUser = { ...user, progress: next };
                           setUser(newUser);
                           localStorage.setItem("user", JSON.stringify(newUser));
                           alert("Sadhana Recorded. You are ascending!");
                       }
                   } catch (e) { console.error(e); }
                }}
                className="mt-auto w-full py-4 bg-white text-accent rounded-[2rem] font-black hover:scale-[1.02] transition-transform shadow-xl active:scale-[0.98]"
            >
               Update Progress
            </button>
          </motion.div>

        </div>

      </div>

    </div>
  );
}