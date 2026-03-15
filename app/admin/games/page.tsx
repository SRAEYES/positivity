"use client";
import React from "react";

import { useState, useEffect } from "react";
import { Gamepad2, Plus, Brain, Timer, ArrowLeft, Loader2, X, Trash2, Layers, CreditCard, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type ActiveTab = "quiz" | "puzzle" | "history" | "deities" | "cards";

export default function AdminGames() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [puzzles, setPuzzles] = useState<any[]>([]);
    const [quests, setQuests] = useState<any[]>([]);
    const [deities, setDeities] = useState<any[]>([]);
    const [smartCards, setSmartCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ActiveTab>("quiz");

    // --- Create modals ---
    const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
    const [isCreatingPuzzle, setIsCreatingPuzzle] = useState(false);
    const [isCreatingQuest, setIsCreatingQuest] = useState(false);
    const [isCreatingDeity, setIsCreatingDeity] = useState(false);
    const [isCreatingCard, setIsCreatingCard] = useState(false);

    // --- Edit modals ---
    const [editingQuiz, setEditingQuiz] = useState<any>(null);
    const [editingPuzzle, setEditingPuzzle] = useState<any>(null);
    const [editingQuest, setEditingQuest] = useState<any>(null);
    const [editingDeity, setEditingDeity] = useState<any>(null);
    const [editingCard, setEditingCard] = useState<any>(null);

    // --- Create form states ---
    const [newQuiz, setNewQuiz] = useState({ title: "", description: "" });
    const [newPuzzle, setNewPuzzle] = useState({ title: "", fullText: "", tiles: "" });
    const [newQuest, setNewQuest] = useState({ title: "", description: "" });
    const [newDeity, setNewDeity] = useState({ name: "", info: "", image: "", color: "from-primary to-secondary" });
    const [newCard, setNewCard] = useState({ sanskrit: "", english: "", example: "" });

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [qRes, pRes, hRes, dRes, cRes] = await Promise.all([
                fetch("/api/admin/games"),
                fetch("/api/admin/games/puzzles"),
                fetch("/api/admin/games/history"),
                fetch("/api/admin/games/deities"),
                fetch("/api/admin/games/smartcards"),
            ]);
            const [qData, pData, hData, dData, cData] = await Promise.all([
                qRes.json(), pRes.json(), hRes.json(), dRes.json(), cRes.json()
            ]);
            setQuizzes(Array.isArray(qData) ? qData : qData.quizzes || []);
            setPuzzles(Array.isArray(pData) ? pData : []);
            setQuests(Array.isArray(hData) ? hData : []);
            setDeities(Array.isArray(dData) ? dData : []);
            setSmartCards(Array.isArray(cData) ? cData : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // --- Create handlers ---
    const handleCreate = async (url: string, body: any, onDone: () => void) => {
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (res.ok) { onDone(); fetchAll(); }
    };

    // --- Edit handlers ---
    const handleEdit = async (url: string, body: any) => {
        const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (res.ok) {
            setEditingQuiz(null); setEditingPuzzle(null); setEditingQuest(null);
            setEditingDeity(null); setEditingCard(null);
            fetchAll();
        }
    };

    // --- Delete handlers ---
    const del = async (url: string) => {
        if (!confirm("Delete this item forever?")) return;
        await fetch(url, { method: "DELETE" });
        fetchAll();
    };

    const TABS: { key: ActiveTab; label: string }[] = [
        { key: "quiz", label: "Wisdom Quizzes" },
        { key: "puzzle", label: "Vedic Puzzles" },
        { key: "history", label: "History Quests" },
        { key: "deities", label: "Divine Stack" },
        { key: "cards", label: "Smart Cards" },
    ];

    return (
        <div className="min-h-screen bg-white p-6 md:p-12 text-zinc-900">
            <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button onClick={() => window.location.href = '/admin/dashboard'} className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-5 hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Return to Insight
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Spiritual <span className="text-secondary italic">Arena</span></h1>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1">Manage all games and challenges.</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {activeTab === "quiz" && <Button onClick={() => setIsCreatingQuiz(true)} className="bg-primary hover:bg-primary/90 text-white h-11 px-5 rounded-xl font-black text-xs"><Plus className="w-4 h-4 mr-1" /> New Quiz</Button>}
                    {activeTab === "puzzle" && <Button onClick={() => setIsCreatingPuzzle(true)} className="bg-secondary hover:bg-secondary/90 text-white h-11 px-5 rounded-xl font-black text-xs"><Plus className="w-4 h-4 mr-1" /> New Puzzle</Button>}
                    {activeTab === "history" && <Button onClick={() => setIsCreatingQuest(true)} className="bg-amber-500 hover:bg-amber-600 text-white h-11 px-5 rounded-xl font-black text-xs"><Plus className="w-4 h-4 mr-1" /> New Quest</Button>}
                    {activeTab === "deities" && <Button onClick={() => setIsCreatingDeity(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-5 rounded-xl font-black text-xs"><Plus className="w-4 h-4 mr-1" /> Add Deity</Button>}
                    {activeTab === "cards" && <Button onClick={() => setIsCreatingCard(true)} className="bg-rose-500 hover:bg-rose-600 text-white h-11 px-5 rounded-xl font-black text-xs"><Plus className="w-4 h-4 mr-1" /> Add Card</Button>}
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto flex gap-1 mb-8 border-b border-zinc-100 pb-px overflow-x-auto">
                {TABS.map(t => <TabButton key={t.key} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} label={t.label} />)}
            </div>

            <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-primary w-8 h-8" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Loading...</p>
                        </div>
                    ) : (
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {activeTab === "quiz" && quizzes.map(q => (
                                <GameCard key={q.id} title={q.title} desc={q.description} meta={`${q._count?.questions || 0} Questions`} status={q.isActive ? 'Live' : 'Closed'} icon={<Gamepad2 className="w-5 h-5" />}
                                    onEdit={() => setEditingQuiz({ ...q })} onDelete={() => del(`/api/admin/games/${q.id}`)} />
                            ))}
                            {activeTab === "quiz" && <CreateCard onClick={() => setIsCreatingQuiz(true)} label="New Quiz" />}

                            {activeTab === "puzzle" && puzzles.map(p => (
                                <GameCard key={p.id} title={p.title} desc={p.fullText} meta={`${JSON.parse(p.tiles).length} Tiles`} icon={<Brain className="w-5 h-5" />}
                                    onEdit={() => setEditingPuzzle({ ...p, tilesStr: JSON.parse(p.tiles).join(", ") })} onDelete={() => del(`/api/admin/games/puzzles?id=${p.id}`)} />
                            ))}
                            {activeTab === "puzzle" && <CreateCard onClick={() => setIsCreatingPuzzle(true)} label="New Puzzle" />}

                            {activeTab === "history" && quests.map(q => (
                                <GameCard key={q.id} title={q.title} desc={q.description} meta={`${JSON.parse(q.events).length} Events`} icon={<Timer className="w-5 h-5" />}
                                    onEdit={() => setEditingQuest({ ...q })} onDelete={() => del(`/api/admin/games/history?id=${q.id}`)} />
                            ))}
                            {activeTab === "history" && <CreateCard onClick={() => setIsCreatingQuest(true)} label="New History Quest" />}

                            {activeTab === "deities" && deities.map(d => (
                                <GameCard key={d.id} title={d.name} desc={d.info} meta="Divine Stack Card" icon={<Layers className="w-5 h-5" />}
                                    onEdit={() => setEditingDeity({ ...d })} onDelete={() => del(`/api/admin/games/deities?id=${d.id}`)} />
                            ))}
                            {activeTab === "deities" && <CreateCard onClick={() => setIsCreatingDeity(true)} label="Add Deity" />}

                            {activeTab === "cards" && smartCards.map(c => (
                                <GameCard key={c.id} title={c.sanskrit} desc={c.english} meta={c.example || "Vocabulary Card"} icon={<CreditCard className="w-5 h-5" />}
                                    onEdit={() => setEditingCard({ ...c })} onDelete={() => del(`/api/admin/games/smartcards?id=${c.id}`)} />
                            ))}
                            {activeTab === "cards" && <CreateCard onClick={() => setIsCreatingCard(true)} label="Add Smart Card" />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ====== CREATE MODALS ====== */}
            <Modal isOpen={isCreatingQuiz} onClose={() => setIsCreatingQuiz(false)} title="New Wisdom Quiz">
                <FormField label="Title"><Inp value={newQuiz.title} onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} placeholder="Quiz title..." /></FormField>
                <FormField label="Description"><Textarea value={newQuiz.description} onChange={e => setNewQuiz({...newQuiz, description: e.target.value})} placeholder="Brief description..." /></FormField>
                <Button onClick={() => handleCreate("/api/admin/games", newQuiz, () => setIsCreatingQuiz(false))} className="w-full bg-primary text-white h-12 rounded-xl font-black">Create Quiz</Button>
            </Modal>

            <Modal isOpen={isCreatingPuzzle} onClose={() => setIsCreatingPuzzle(false)} title="New Vedic Puzzle">
                <FormField label="Title"><Inp value={newPuzzle.title} onChange={e => setNewPuzzle({...newPuzzle, title: e.target.value})} placeholder="Puzzle title..." /></FormField>
                <FormField label="Full Sloka / Text"><Textarea value={newPuzzle.fullText} onChange={e => setNewPuzzle({...newPuzzle, fullText: e.target.value})} placeholder="Full sacred text..." /></FormField>
                <FormField label="Tiles (comma separated)"><Textarea value={newPuzzle.tiles} onChange={e => setNewPuzzle({...newPuzzle, tiles: e.target.value})} placeholder="Hare, Krishna, Hare, Rama..." /></FormField>
                <Button onClick={() => handleCreate("/api/admin/games/puzzles", {...newPuzzle, tiles: newPuzzle.tiles.split(",").map(t => t.trim())}, () => setIsCreatingPuzzle(false))} className="w-full bg-secondary text-white h-12 rounded-xl font-black">Create Puzzle</Button>
            </Modal>

            <Modal isOpen={isCreatingQuest} onClose={() => setIsCreatingQuest(false)} title="New History Quest">
                <FormField label="Title"><Inp value={newQuest.title} onChange={e => setNewQuest({...newQuest, title: e.target.value})} placeholder="Quest title..." /></FormField>
                <FormField label="Description"><Textarea value={newQuest.description} onChange={e => setNewQuest({...newQuest, description: e.target.value})} placeholder="Description..." /></FormField>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Note: Add events after creation by editing the quest.</p>
                <Button onClick={() => handleCreate("/api/admin/games/history", {...newQuest, events: []}, () => setIsCreatingQuest(false))} className="w-full bg-amber-500 text-white h-12 rounded-xl font-black">Create Quest</Button>
            </Modal>

            <Modal isOpen={isCreatingDeity} onClose={() => setIsCreatingDeity(false)} title="Add Sacred Deity">
                <FormField label="Name"><Inp value={newDeity.name} onChange={e => setNewDeity({...newDeity, name: e.target.value})} placeholder="e.g. Sri Krishna" /></FormField>
                <FormField label="Description"><Textarea value={newDeity.info} onChange={e => setNewDeity({...newDeity, info: e.target.value})} placeholder="Short sacred description..." /></FormField>
                <FormField label="Image URL"><Inp value={newDeity.image} onChange={e => setNewDeity({...newDeity, image: e.target.value})} placeholder="https://..." /></FormField>
                <FormField label="Gradient (optional)"><Inp value={newDeity.color} onChange={e => setNewDeity({...newDeity, color: e.target.value})} placeholder="from-blue-600 to-indigo-900" /></FormField>
                <Button onClick={() => handleCreate("/api/admin/games/deities", newDeity, () => setIsCreatingDeity(false))} className="w-full bg-indigo-600 text-white h-12 rounded-xl font-black">Add to Stack</Button>
            </Modal>

            <Modal isOpen={isCreatingCard} onClose={() => setIsCreatingCard(false)} title="Add Smart Card">
                <FormField label="Sanskrit Word"><Inp value={newCard.sanskrit} onChange={e => setNewCard({...newCard, sanskrit: e.target.value})} placeholder="e.g. Karma" /></FormField>
                <FormField label="English Meaning"><Inp value={newCard.english} onChange={e => setNewCard({...newCard, english: e.target.value})} placeholder="e.g. Law of Cause & Effect" /></FormField>
                <FormField label="Example Quote (optional)"><Textarea value={newCard.example} onChange={e => setNewCard({...newCard, example: e.target.value})} placeholder="Every action ripples through eternity..." /></FormField>
                <Button onClick={() => handleCreate("/api/admin/games/smartcards", newCard, () => setIsCreatingCard(false))} className="w-full bg-rose-500 text-white h-12 rounded-xl font-black">Add Card</Button>
            </Modal>

            {/* ====== EDIT MODALS ====== */}
            <Modal isOpen={!!editingQuiz} onClose={() => setEditingQuiz(null)} title="Edit Quiz">
                {editingQuiz && <>
                    <FormField label="Title"><Inp value={editingQuiz.title} onChange={e => setEditingQuiz({...editingQuiz, title: e.target.value})} /></FormField>
                    <FormField label="Description"><Textarea value={editingQuiz.description || ""} onChange={e => setEditingQuiz({...editingQuiz, description: e.target.value})} /></FormField>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="isActive" checked={editingQuiz.isActive} onChange={e => setEditingQuiz({...editingQuiz, isActive: e.target.checked})} className="w-5 h-5 accent-primary rounded" />
                        <label htmlFor="isActive" className="text-sm font-bold">Active (visible to students)</label>
                    </div>
                    <Button onClick={() => handleEdit(`/api/admin/games/${editingQuiz.id}`, { id: editingQuiz.id, title: editingQuiz.title, description: editingQuiz.description, isActive: editingQuiz.isActive })} className="w-full bg-primary text-white h-12 rounded-xl font-black">Save Changes</Button>
                </>}
            </Modal>

            <Modal isOpen={!!editingPuzzle} onClose={() => setEditingPuzzle(null)} title="Edit Puzzle">
                {editingPuzzle && <>
                    <FormField label="Title"><Inp value={editingPuzzle.title} onChange={e => setEditingPuzzle({...editingPuzzle, title: e.target.value})} /></FormField>
                    <FormField label="Full Sloka"><Textarea value={editingPuzzle.fullText} onChange={e => setEditingPuzzle({...editingPuzzle, fullText: e.target.value})} /></FormField>
                    <FormField label="Tiles (comma separated)"><Textarea value={editingPuzzle.tilesStr} onChange={e => setEditingPuzzle({...editingPuzzle, tilesStr: e.target.value})} /></FormField>
                    <Button onClick={() => handleEdit("/api/admin/games/puzzles", { id: editingPuzzle.id, title: editingPuzzle.title, fullText: editingPuzzle.fullText, tiles: editingPuzzle.tilesStr.split(",").map((t: string) => t.trim()) })} className="w-full bg-secondary text-white h-12 rounded-xl font-black">Save Changes</Button>
                </>}
            </Modal>

            <Modal isOpen={!!editingQuest} onClose={() => setEditingQuest(null)} title="Edit History Quest">
                {editingQuest && <>
                    <FormField label="Title"><Inp value={editingQuest.title} onChange={e => setEditingQuest({...editingQuest, title: e.target.value})} /></FormField>
                    <FormField label="Description"><Textarea value={editingQuest.description || ""} onChange={e => setEditingQuest({...editingQuest, description: e.target.value})} /></FormField>
                    <Button onClick={() => handleEdit("/api/admin/games/history", { id: editingQuest.id, title: editingQuest.title, description: editingQuest.description, events: JSON.parse(editingQuest.events) })} className="w-full bg-amber-500 text-white h-12 rounded-xl font-black">Save Changes</Button>
                </>}
            </Modal>

            <Modal isOpen={!!editingDeity} onClose={() => setEditingDeity(null)} title="Edit Deity">
                {editingDeity && <>
                    <FormField label="Name"><Inp value={editingDeity.name} onChange={e => setEditingDeity({...editingDeity, name: e.target.value})} /></FormField>
                    <FormField label="Description"><Textarea value={editingDeity.info} onChange={e => setEditingDeity({...editingDeity, info: e.target.value})} /></FormField>
                    <FormField label="Image URL"><Inp value={editingDeity.image} onChange={e => setEditingDeity({...editingDeity, image: e.target.value})} /></FormField>
                    <FormField label="Gradient"><Inp value={editingDeity.color} onChange={e => setEditingDeity({...editingDeity, color: e.target.value})} /></FormField>
                    <Button onClick={() => handleEdit("/api/admin/games/deities", { id: editingDeity.id, name: editingDeity.name, info: editingDeity.info, image: editingDeity.image, color: editingDeity.color })} className="w-full bg-indigo-600 text-white h-12 rounded-xl font-black">Save Changes</Button>
                </>}
            </Modal>

            <Modal isOpen={!!editingCard} onClose={() => setEditingCard(null)} title="Edit Smart Card">
                {editingCard && <>
                    <FormField label="Sanskrit Word"><Inp value={editingCard.sanskrit} onChange={e => setEditingCard({...editingCard, sanskrit: e.target.value})} /></FormField>
                    <FormField label="English Meaning"><Inp value={editingCard.english} onChange={e => setEditingCard({...editingCard, english: e.target.value})} /></FormField>
                    <FormField label="Example Quote"><Textarea value={editingCard.example || ""} onChange={e => setEditingCard({...editingCard, example: e.target.value})} /></FormField>
                    <Button onClick={() => handleEdit("/api/admin/games/smartcards", { id: editingCard.id, sanskrit: editingCard.sanskrit, english: editingCard.english, example: editingCard.example })} className="w-full bg-rose-500 text-white h-12 rounded-xl font-black">Save Changes</Button>
                </>}
            </Modal>
        </div>
    );
}

function TabButton({ active, onClick, label }: any) {
    return (
        <button onClick={onClick} className={`px-5 py-3 font-black uppercase tracking-widest text-[10px] transition-all relative whitespace-nowrap ${active ? 'text-primary' : 'text-zinc-400 hover:text-zinc-700'}`}>
            {label}
            {active && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
        </button>
    );
}

function GameCard({ title, desc, meta, status, icon, onEdit, onDelete }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-primary border border-zinc-100">{icon}</div>
                    <div className="flex gap-2">
                        {status && <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status === 'Live' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-400'}`}>{status}</span>}
                    </div>
                </div>
                <h3 className="text-base font-black mb-1 tracking-tight line-clamp-1">{title}</h3>
                <p className="text-xs text-zinc-400 font-medium line-clamp-2 italic leading-relaxed">{desc || "—"}</p>
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-zinc-50 mt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{meta}</span>
                <div className="flex gap-1">
                    <button onClick={onEdit} className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-primary/5 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={onDelete} className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function CreateCard({ onClick, label }: any) {
    return (
        <button onClick={onClick} className="p-8 border-2 border-dashed border-zinc-100 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all group min-h-[160px]">
            <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-300 group-hover:bg-primary group-hover:text-white transition-all"><Plus className="w-5 h-5" /></div>
            <span className="font-black uppercase tracking-widest text-[10px] text-zinc-300 group-hover:text-primary">{label}</span>
        </button>
    );
}

function Modal({ isOpen, onClose, title, children }: any) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-8 relative shadow-2xl border border-zinc-100">
                        <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 bg-zinc-50 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                            <X className="w-4 h-4" />
                        </button>
                        <h2 className="text-xl font-black mb-6 tracking-tighter">{title}</h2>
                        <div className="space-y-4">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function FormField({ label, children }: any) {
    return (
        <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
            {children}
        </div>
    );
}

function Inp(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className="h-12 bg-zinc-50 rounded-xl px-4 font-semibold text-sm outline-none focus:ring-2 focus:ring-primary border-transparent border-2 focus:border-white transition-all w-full" />;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className="h-24 bg-zinc-50 rounded-xl p-4 font-semibold text-sm outline-none focus:ring-2 focus:ring-primary border-transparent border-2 focus:border-white transition-all w-full resize-none" />;
}
