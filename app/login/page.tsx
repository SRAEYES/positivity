"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sun, Sparkles, ArrowRight } from "lucide-react"

export default function SplitLoginCard() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Redirect to correct dashboard if already logged in
    useEffect(() => {
        if (typeof window !== "undefined" && localStorage.getItem("user")) {
            const user = JSON.parse(localStorage.getItem("user")!);
            if (user.role === "admin") {
                router.replace("/admin/dashboard");
            } else {
                router.replace("/dashboard");
            }
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                const data = await res.json();
                if (typeof window !== "undefined") {
                  const savedUser = { ...data.user };
                  delete savedUser.imageUrl;
                  localStorage.setItem("user", JSON.stringify(savedUser));
                  if (data.user.role === "admin") {
                    router.push("/admin/dashboard");
                  } else {
                    router.push("/dashboard");
                  }
                }
            } else {
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    } 

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-6">
            
            {/* Spiritual Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-10 z-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[100px] rounded-full -ml-48 -mb-48"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Branding */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 mb-6 rotate-3">
                        <Sun className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-primary tracking-tighter mb-2 italic">
                        DharmaVeda
                    </h1>
                    <p className="text-foreground/60 font-medium">Reconnecting with Eternal Wisdom</p>
                </div>

                <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-2xl p-10 md:p-12 rounded-[3.5rem] shadow-2xl border border-white/50 dark:border-white/10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-foreground mb-2">Welcome Back</h2>
                        <p className="text-foreground/60">Enter your core details to continue your spiritual journey.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Eternal Email</Label>
                            <Input 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                type="email" 
                                placeholder="seeker@dharma.com" 
                                className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border focus:ring-primary/20" 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest opacity-60">Secret Key</Label>
                                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
                            </div>
                            <Input 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                type="password" 
                                placeholder="••••••••" 
                                className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border focus:ring-primary/20" 
                                required 
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-white text-lg font-black shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Sparkles className="w-6 h-6 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">Ascend to Dashboard <ArrowRight className="w-5 h-5" /></span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-white dark:border-white/5 shadow-inner">
                        <p className="text-sm font-medium text-foreground/60">
                            New seeker? {" "}
                            <motion.a 
                                whileHover={{ scale: 1.05 }}
                                href="/register" 
                                className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary font-black hover:underline underline-offset-4 glow-lotus"
                            >
                                Create Your Path
                            </motion.a>
                        </p>
                    </div>
                </div>

                <p className="mt-12 text-center text-xs font-black uppercase tracking-[0.2em] opacity-30">
                    Seek Truth. Find Peace. DharmaVeda.
                </p>
            </motion.div>
        </div>
    )
}

