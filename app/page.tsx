"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Book, Users, Star, ArrowRight, Heart, Sparkles, Sun } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      
      {/* Absolute background element for spiritual feel */}
      <div className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-10 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-6 md:px-12 py-8 max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-12 transition-transform">
            <Sun className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-primary tracking-tighter">
            DharmaVeda
          </h1>
        </div>

        <div className="hidden md:flex gap-8 items-center font-medium">
          <a href="#about" className="hover:text-primary transition-colors">Wisdom</a>
          <a href="#courses" className="hover:text-primary transition-colors">Courses</a>
          <a href="#community" className="hover:text-primary transition-colors">Sangha</a>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.push("/login")}
            className="text-foreground/80 hover:text-primary font-semibold transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/register")}
            className="bg-primary text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            Start Journey
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="md:w-1/2 relative z-20 w-full"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground text-xs md:text-sm font-bold mb-6 border border-secondary/20">
            <Sparkles className="w-4 h-4" />
            <span>Discover Ancient Truths</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-8xl font-black leading-tight md:leading-[0.9] text-foreground mb-8 drop-shadow-sm"
          >
            Awaken the <br />
            <span className="text-primary italic">Eternal Spirit</span> <br />
            Within You.
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-foreground/70 max-w-xl mb-10 leading-relaxed font-medium mx-auto md:mx-0"
          >
            Experience the profound wisdom of Sanatana Dharma through interactive courses in Sanskrit, Vedic philosophy, and spiritual discipline.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => router.push("/courses")}
              className="bg-accent text-white px-8 md:px-10 py-4 md:py-5 rounded-3xl text-lg font-black shadow-2xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Explore Wisdom <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/register")}
              className="bg-white/50 backdrop-blur-md border border-border px-10 py-5 rounded-3xl text-lg font-bold hover:bg-white transition-all"
            >
              Join the Sangha
            </button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-12 flex items-center justify-center md:justify-start gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="font-bold uppercase tracking-widest text-xs">As seen in</div>
            <div className="text-xl font-bold">VedicTimes</div>
            <div className="text-xl font-bold">BharatSpiritual</div>
            <div className="text-xl font-bold">DharmaToday</div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full md:w-1/2 relative mt-12 md:mt-0"
        >
          <div className="w-full aspect-square bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/10 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden shadow-2xl border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Meditation and Wisdom" 
              className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
            
            {/* Floating UI element */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-6 rounded-[2rem] md:rounded-3xl text-left"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                  <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm md:text-base">Featured Course</h4>
                  <p className="text-white/60 text-[10px] md:text-xs">Bhagavad Gita Masterclass</p>
                </div>
              </div>
              <div className="w-full h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-primary"></div>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/20 blur-3xl rounded-full"></div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="about" className="py-32 bg-white/30 dark:bg-zinc-900/10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Wisdom for the Modern Seeker</h2>
            <p className="text-lg text-foreground/60">We bridge the gap between ancient traditions and modern lifestyle, providing authentic knowledge with practical application.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-10 bg-white dark:bg-zinc-800 rounded-[3rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 active:bg-zinc-900 active:scale-95 transition-all border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-active:scale-90 transition-all">
                <Book className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-primary group-active:text-white transition-colors uppercase tracking-tight">Vedic Science</h3>
              <p className="text-foreground/60 leading-relaxed group-active:text-white/40 transition-colors">Deep dive into the structural wisdom of the Vedas and Upanishads, decoded for logical understanding.</p>
            </div>

            <div className="group p-10 bg-white dark:bg-zinc-800 rounded-[3rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 active:bg-zinc-900 active:scale-95 transition-all border border-border">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary group-active:scale-90 transition-all">
                <Search className="w-8 h-8 text-secondary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-secondary group-active:text-white transition-colors uppercase tracking-tight">Sanskrit Roots</h3>
              <p className="text-foreground/60 leading-relaxed group-active:text-white/40 transition-colors">Master the language of the gods. Learn Sanskrit not just as a language, but as a vibrational tool for consciousness.</p>
            </div>

            <div className="group p-10 bg-white dark:bg-zinc-800 rounded-[3rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 active:bg-zinc-900 active:scale-95 transition-all border border-border">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent group-active:scale-90 transition-all">
                <Users className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-accent group-active:text-white transition-colors uppercase tracking-tight">Global Sangha</h3>
              <p className="text-foreground/60 leading-relaxed group-active:text-white/40 transition-colors">Connect with thousands of like-minded seekers from across the globe. Grow together in spirit and knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Wisdom Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto p-12 md:p-20 bg-accent rounded-[4rem] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-3xl -mr-48 -mt-48 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 blur-3xl -ml-48 -mb-48 rounded-full"></div>
          
          <div className="relative z-10 text-center">
            <Heart className="w-12 h-12 mx-auto mb-8 text-secondary animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-black mb-8 italic">"Yogastha Kuru Karmani"</h2>
            <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto font-medium leading-relaxed">
              Established in Yoga, O Arjuna, perform your actions, abandoning attachment, and remaining balanced in success and failure.
            </p>
            <div className="mt-8 text-primary font-bold tracking-widest uppercase text-sm">— Shrimad Bhagavad Gita, 2.48</div>
            
            <button
               onClick={() => router.push("/register")}
               className="mt-12 bg-white text-accent px-12 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform"
            >
              Start My Transformation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <Sun className="text-primary w-6 h-6" />
            <h1 className="text-xl font-black text-primary tracking-tighter">
              DharmaVeda
            </h1>
          </div>
          
          <div className="flex gap-10 text-sm font-bold opacity-60">
            <a href="#" className="hover:text-primary">Wisdom</a>
            <a href="#" className="hover:text-primary">Sangha</a>
            <a href="#" className="hover:text-primary">Contact</a>
            <a href="#" className="hover:text-primary">Terms</a>
          </div>

          <p className="text-sm opacity-40">
            © {new Date().getFullYear()} DharmaVeda. Preserving Eternal Wisdom.
          </p>
        </div>
      </footer>

    </div>
  );
}