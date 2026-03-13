"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Logout() {
  const router = useRouter();
  
  useEffect(() => {
    const performLogout = async () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
        // Brief delay to allow the farewell message to be felt
        setTimeout(() => {
            router.replace("/login");
        }, 1500);
    };
    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-sandalwood-50 dark:bg-black flex flex-col items-center justify-center p-8">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-8"
        >
            <div className="w-24 h-24 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-12 h-12 text-saffron animate-pulse" />
            </div>
            <h1 className="text-4xl font-black text-deep-indigo tracking-tight">Shanti, Shanti, Shanti.</h1>
            <p className="text-deep-indigo/40 font-medium italic">Your progress is preserved in the cosmic record. Returning to the threshold...</p>
        </motion.div>
    </div>
  );
}

