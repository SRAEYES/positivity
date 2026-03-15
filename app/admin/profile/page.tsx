"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    PenTool, Save, ArrowLeft, Loader2, Sparkles, User, GraduationCap, Briefcase, FileText, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeacherProfileManagement() {
    const [profile, setProfile] = useState({
        id: null,
        name: "",
        qualifications: "",
        experience: "",
        bio: "",
        imageUrl: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/admin/teacher");
            const data = await res.json();
            if (data.id) setProfile(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/teacher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
            });
            if (res.ok) {
                // Success feedback
                const notification = document.createElement("div");
                notification.className = "fixed top-12 right-12 z-[100] bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black shadow-2xl animate-in slide-in-from-right-10";
                notification.innerHTML = "Identity Manifested Successfully!";
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);
            }
        } catch (e) { alert("Failed to save changes."); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <p className="text-foreground/40 font-black uppercase tracking-widest text-sm">Synchronizing with Cosmos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-16">
                    <div>
                        <button 
                            onClick={() => window.location.href = '/admin/dashboard'}
                            className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest mb-6 hover:text-accent transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Return to Insight
                        </button>
                        <h1 className="text-5xl font-black text-foreground tracking-tighter italic">
                            Master <span className="text-accent text-6xl">Profile</span>
                        </h1>
                        <p className="text-foreground/40 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Curate the image of the Guide</p>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 rounded-[4rem] p-10 md:p-16 shadow-2xl border border-zinc-100 dark:border-zinc-800"
                >
                    <form onSubmit={handleSave} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ml-1 opacity-40">
                                    <User className="w-3 h-3" /> Guide Name
                                </Label>
                                <Input 
                                    value={profile.name}
                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                    placeholder="Enter full sacred name"
                                    className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent px-8 font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ml-1 opacity-40">
                                    <GraduationCap className="w-3 h-3" /> Qualifications
                                </Label>
                                <Input 
                                    value={profile.qualifications}
                                    onChange={(e) => setProfile({...profile, qualifications: e.target.value})}
                                    placeholder="Ph.D, Acharya, etc."
                                    className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent px-8 font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ml-1 opacity-40">
                                <Briefcase className="w-3 h-3" /> Professional Experience
                            </Label>
                            <Input 
                                value={profile.experience}
                                onChange={(e) => setProfile({...profile, experience: e.target.value})}
                                placeholder="Teaching history and legacy"
                                className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent px-8 font-bold text-lg"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ml-1 opacity-40">
                                <ImageIcon className="w-3 h-3" /> Guide Portrait URL
                            </Label>
                            <div className="flex gap-4">
                                <Input 
                                    value={profile.imageUrl}
                                    onChange={(e) => setProfile({...profile, imageUrl: e.target.value})}
                                    placeholder="Enter image URL or path"
                                    className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent px-8 font-bold text-lg grow"
                                />
                                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
                                    {profile.imageUrl ? (
                                        <img src={profile.imageUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 opacity-20" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ml-1 opacity-40">
                                <FileText className="w-3 h-3" /> Teacher's Biography
                            </Label>
                            <textarea 
                                value={profile.bio}
                                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                placeholder="Describe the journey and mission..."
                                className="w-full min-h-[200px] bg-zinc-50 dark:bg-zinc-950 rounded-[2.5rem] p-10 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all border border-transparent"
                            />
                        </div>

                        <Button 
                            type="submit"
                            disabled={saving}
                            className="w-full h-24 bg-accent hover:bg-accent/90 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-accent/20 transition-all"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : (
                                <span className="flex items-center gap-4">
                                    Update Teacher Identity <Sparkles className="w-6 h-6" />
                                </span>
                            )}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
