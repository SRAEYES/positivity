"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, MapPin, Globe, Home, Users, Edit3, Save, X, Sparkles, Loader2, Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    async function fetchUserProfile() {
      const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (stored) {
        const parsedUser = JSON.parse(stored);
        try {
          const res = await fetch(`/api/user/${parsedUser.id}`);
          if (res.ok) {
            const fullProfile = await res.json();
            setUser(fullProfile);
            setFormData(fullProfile);
          } else {
            setUser(parsedUser);
            setFormData(parsedUser);
          }
        } catch (error) {
           setUser(parsedUser);
           setFormData(parsedUser);
        }
      }
      setLoading(false);
    }
    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsEditing(false);
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        stored.name = data.user.name;
        localStorage.setItem("user", JSON.stringify(stored));
      } else {
        alert("Failed to update profile");
      }
    } catch {
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-foreground/40 font-black uppercase tracking-widest text-sm">Consulting the Akasha...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <X className="w-16 h-16 text-destructive opacity-30" />
        <p className="text-2xl font-black text-foreground/50 italic">Presence Not Found</p>
        <Button onClick={() => window.location.href = "/login"}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      
      {/* Profile Header */}
      <div className="relative pt-20 pb-40 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-transparent z-0"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative mb-10"
            >
                <div className="w-40 h-40 bg-white dark:bg-zinc-800 rounded-[3rem] p-1 shadow-2xl border-4 border-primary/20 relative group">
                    <div className="w-full h-full bg-primary/5 rounded-[2.8rem] flex items-center justify-center overflow-hidden">
                        <User className="w-20 h-20 text-primary opacity-30" />
                    </div>
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/40 rounded-[2.8rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="text-white w-8 h-8" />
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-12">
                    <Sparkles className="text-white w-6 h-6" />
                </div>
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-4 italic"
            >
                {user.name}
            </motion.h1>
            <p className="text-primary font-black uppercase tracking-[0.3em] text-sm opacity-60">
                Authorized {user.role}
            </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 -mt-24 relative z-20">
        <motion.div 
            layout
            className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] shadow-2xl border border-white dark:border-white/5"
        >
            <div className="flex justify-between items-center mb-12 border-b border-zinc-100 dark:border-zinc-700 pb-8">
                <h2 className="text-3xl font-black text-foreground tracking-tight">Personal Details</h2>
                {!isEditing && (
                    <Button 
                        onClick={() => setIsEditing(true)} 
                        className="h-14 px-8 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-black transition-all gap-2"
                    >
                        <Edit3 className="w-4 h-4" />
                        Modify Record
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.form 
                        key="edit-mode"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleSave} 
                        className="grid grid-cols-1 md:grid-cols-2 gap-10"
                    >
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Thy Eternal Name</Label>
                                <Input name="name" value={formData.name || ""} onChange={handleChange} className="h-14 bg-zinc-50 dark:bg-zinc-900 border-transparent rounded-2xl px-6 font-bold" required />
                            </div>
                            <div className="space-y-2 opacity-60">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Eternal Email (Immutable)</Label>
                                <Input value={formData.email || ""} disabled className="h-14 bg-zinc-100 dark:bg-zinc-900 border-transparent rounded-2xl px-6 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Age in Years</Label>
                                <Input name="age" type="number" value={formData.age || ""} onChange={handleChange} className="h-14 bg-zinc-50 dark:bg-zinc-900 border-transparent rounded-2xl px-6 font-bold" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Country</Label>
                                    <Input name="country" value={formData.country || ""} onChange={handleChange} className="h-14 bg-zinc-50 dark:bg-zinc-900 border-transparent rounded-2xl px-6 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">State</Label>
                                    <Input name="state" value={formData.state || ""} onChange={handleChange} className="h-14 bg-zinc-50 dark:bg-zinc-900 border-transparent rounded-2xl px-6 font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Sacred Location</Label>
                                <Input name="location" value={formData.location || ""} onChange={handleChange} className="h-14 bg-zinc-50 dark:bg-zinc-900 border-transparent rounded-2xl px-6 font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Guardian</Label>
                                    <Input name="parentName" value={formData.parentName || ""} onChange={handleChange} className="h-14 bg-zinc-50 dark:bg-zinc-900 border-transparent rounded-2xl px-6 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Bond</Label>
                                    <Input name="parentRel" value={formData.parentRel || ""} onChange={handleChange} className="h-14 bg-zinc-50 dark:bg-zinc-900 border-transparent rounded-2xl px-6 font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full flex gap-4 mt-10">
                            <Button type="button" variant="outline" className="h-16 flex-1 rounded-[1.5rem] font-black uppercase tracking-widest text-xs" onClick={() => { setIsEditing(false); setFormData(user); }}>
                                Discard Changes
                            </Button>
                            <Button type="submit" disabled={saving} className="h-16 flex-[2] rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                                {saving ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Seal Changes</span>}
                            </Button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div 
                        key="view-mode"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12"
                    >
                        <div className="space-y-10">
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Eternal Email</p>
                                    <p className="text-xl font-bold">{user.email || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Dharmic Role</p>
                                    <p className="text-xl font-bold capitalize">{user.role || "student"}</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Age</p>
                                    <p className="text-xl font-bold">{user.age || "N/A"} Lunar Years</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Residence</p>
                                    <p className="text-xl font-bold">{user.location || "N/A"}, {user.state || ""}, {user.country || ""}</p>
                                </div>
                            </div>
                            {user.parentName && (
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Guardian ({user.parentRel})</p>
                                        <p className="text-xl font-bold">{user.parentName}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <Home className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Joined Sangha</p>
                                    <p className="text-xl font-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}