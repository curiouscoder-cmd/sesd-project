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
                    <header className="h-20" /> {/* Placeholder for next commits */}
                </main>
            </div>
        </div>
    );
}
