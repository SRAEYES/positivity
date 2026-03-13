"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sun, Sparkles, ArrowRight, UserPlus } from "lucide-react"

export default function Register() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        country: "",
        state: "",
        location: "",
        parentName: "",
        parentRel: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const data = await res.json();
                if (typeof window !== "undefined") {
                  localStorage.setItem("user", JSON.stringify(data.user));
                }
                router.push("/dashboard");
            } else {
                alert("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("An error occurred", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-6 py-20">
            
            {/* Spiritual Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-10 z-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            </div>
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full -ml-64 -mt-64"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full -mr-64 -mb-64"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-4xl relative z-10"
            >
                {/* Branding */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 mb-6 -rotate-3">
                        <UserPlus className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-primary tracking-tighter mb-2 italic">
                        Begin Your Path
                    </h1>
                    <p className="text-foreground/60 font-medium italic">"The journey of a thousand miles begins with a single step."</p>
                </div>

                <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-2xl p-8 md:p-16 rounded-[4rem] shadow-2xl border border-white/50 dark:border-white/10">
                    <h2 className="text-3xl font-black text-foreground mb-8">Create Your Profile</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Identity */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Thy Name</Label>
                                    <Input id="name" type="text" placeholder="Arjuna" className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Age in Years</Label>
                                    <Input id="age" type="number" placeholder="25" className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border" value={formData.age} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Eternal Email</Label>
                                    <Input id="email" type="email" placeholder="seeker@dharma.com" className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border" required value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Secret Key</Label>
                                    <Input id="password" type="password" placeholder="••••••••" className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border" required value={formData.password} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <hr className="border-border opacity-50" />

                        {/* Section 2: Location */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="country" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">State of Residence</Label>
                                    <Input id="state" type="text" placeholder="Kerala" className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border" value={formData.state} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Country</Label>
                                    <Input id="country" type="text" placeholder="Bharat" className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border" value={formData.country} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Location Details</Label>
                                <Input id="location" type="text" placeholder="City or Village" className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border" value={formData.location} onChange={handleChange} />
                            </div>
                        </div>

                        <hr className="border-border opacity-50" />

                        {/* Section 3: Guardian */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="parentName" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Guardian's Name</Label>
                                    <Input id="parentName" type="text" placeholder="Drona" className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border" value={formData.parentName} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parentRel" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Relationship</Label>
                                    <Input id="parentRel" type="text" placeholder="Teacher / Father" className="h-14 px-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-border" value={formData.parentRel} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-20 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white text-xl font-black shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] mt-10"
                        >
                            {isLoading ? (
                                <Sparkles className="w-8 h-8 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-3">Initiate Registration <ArrowRight className="w-6 h-6" /></span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-foreground/60 font-medium">
                            Already part of the Sangha? {" "}
                            <a href="/login" className="text-primary font-black hover:underline underline-offset-4">Return Home</a>
                        </p>
                    </div>
                </div>

                <p className="mt-12 text-center text-xs font-black uppercase tracking-[0.25em] opacity-30">
                    DharmaVeda • Ancient Wisdom for the Modern Seeker
                </p>
            </motion.div>
        </div>
    )
}