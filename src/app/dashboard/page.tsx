"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    Home,
    BarChart2,
    Users,
    Mail,
    Settings,
    Plus,
    Search,
    Command,
    Bell,
    Sparkles,
    MoreVertical,
    CheckCircle2,
    Clock,
    Zap
} from "lucide-react";
import { MeshGradient, FrostCard, NavItem, StatPill, chartData } from "@/components/Frost";
import { cn } from "@/lib/utils";

type ChartRange = "Daily" | "Monthly" | "Yearly";

export default function AetherDashboard() {
    const [activeTab, setActiveTab] = useState(0);
    const [chartRange, setChartRange] = useState<ChartRange>("Daily");

    return (
        <div className="min-h-screen font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
            <MeshGradient />

            <div className="mesh-bg">
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
            </div>

            <div className="flex h-screen w-full overflow-hidden p-4 md:p-6 gap-6">

                {/* Floating Sidebar */}
                <motion.aside
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="hidden md:flex w-24 flex-col items-center justify-between rounded-[40px] border border-white/50 bg-white/30 backdrop-blur-2xl py-8 shadow-xl shadow-indigo-500/5"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex flex-col gap-4">
                        {[Home, BarChart2, Users, Mail].map((Icon, i) => (
                            <NavItem
                                key={i}
                                icon={Icon}
                                active={activeTab === i}
                                onClick={() => setActiveTab(i)}
                            />
                        ))}
                    </div>

                    <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 hover:rotate-90 transition-transform duration-500 shadow-sm">
                        <Settings className="h-5 w-5" />
                    </button>
                </motion.aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col gap-6 relative min-w-0">

                    {/* Floating Header */}
                    <motion.header
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center justify-between rounded-[32px] border border-white/60 bg-white/40 px-6 py-4 backdrop-blur-xl shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold tracking-tight text-slate-800">Overview</h1>
                            <div className="hidden lg:flex items-center gap-2 rounded-full bg-white/50 px-3 py-1.5 text-sm text-slate-500 border border-white/50 shadow-inner">
                                <Search className="h-4 w-4" />
                                <span className="pr-8">Search analytics...</span>
                                <div className="flex items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold shadow-sm">
                                    <Command className="h-3 w-3" /> K
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative rounded-full bg-white p-2.5 shadow-sm hover:scale-105 transition-transform">
                                <Bell className="h-5 w-5 text-slate-600" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border border-white" />
                            </button>
                            <div className="flex items-center gap-3 rounded-full bg-white pl-1 pr-4 py-1 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
                                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" className="h-9 w-9 rounded-full bg-indigo-100" />
                                <div className="hidden sm:block">
                                    <p className="text-sm font-bold leading-none">Alex D.</p>
                                    <p className="text-xs text-slate-400">Pro Plan</p>
                                </div>
                            </div>
                        </div>
                    </motion.header>

                    {/* Dashboard Grid Container */}
                    <div className="flex-1 overflow-y-auto rounded-[32px] pr-2 pb-2 scrollbar-hide">
                    </div>
                </main>
            </div>
        </div>
    );
}
