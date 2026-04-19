"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { MeshGradient } from "@/components/Frost";

export default function LandingPage() {
    return (
        <div className="min-h-screen font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col items-center justify-center relative overflow-hidden">
            <MeshGradient />
            
            <div className="mesh-bg">
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 text-center px-4"
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-2xl shadow-indigo-500/40 mx-auto mb-8">
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
                    Split Expenses.<br/>Stay Friends.
                </h1>
                
                <p className="text-lg text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed">
                    The most beautiful way to track shared expenses and settle up with your crew. Powered by Aether design.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Link href="/dashboard">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-black/20 hover:bg-slate-800 transition-colors"
                        >
                            Enter Dashboard <ArrowRight className="h-5 w-5" />
                        </motion.button>
                    </Link>
                    
                    <button className="px-8 py-4 rounded-2xl font-bold text-slate-600 hover:bg-white/50 transition-colors border border-transparent hover:border-white/50">
                        View Demo
                    </button>
                </div>
            </motion.div>

            <div className="absolute bottom-10 text-slate-400 text-sm font-medium">
                © 2026 Aether Finance. All rights reserved.
            </div>
        </div>
    );
}
