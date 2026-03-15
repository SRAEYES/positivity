"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Camera, Image as ImageIcon, Sparkles, Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SpiritualGallery() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages([event.target?.result as string, ...images]);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-1">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mb-4"
            >
              <ChevronLeft className="w-3 h-3" /> Go Back
            </button>
            <h1 className="text-4xl font-black tracking-tighter">Spiritual <span className="text-primary italic">Gallery</span></h1>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Thy Visual Journey of Presence</p>
          </div>

          <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={uploading}
             className="h-16 px-10 bg-primary text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {uploading ? "Manifesting..." : "Upload New Vision"}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*" 
          />
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           <AnimatePresence>
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-[4/5] bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800"
              >
                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Sacred Vision" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <p className="text-[10px] text-white font-black uppercase tracking-widest">Added {new Date().toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 hover:bg-rose-500 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
           </AnimatePresence>

           {images.length === 0 && !uploading && (
             <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-6 opacity-20">
                <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center">
                    <ImageIcon className="w-10 h-10" />
                </div>
                <p className="text-xl font-black italic">The sanctuary is empty...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
