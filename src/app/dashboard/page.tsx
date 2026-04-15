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
                        {activeTab === 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Welcome Section */}
                                <div className="md:col-span-2">
                                    <FrostCard className="h-full flex flex-col justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg shadow-indigo-500/20">
                                        <div className="relative z-10 p-2">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md mb-4 border border-white/10">
                                                    Uilora Analytics Online
                                                </span>
                                                <h2 className="text-3xl font-bold mb-2">Welcome to Uilora, Alex!</h2>
                                                <p className="text-indigo-100 max-w-lg mb-6 text-sm leading-relaxed">
                                                    Your Uilora dashboard user retention has increased by <span className="font-bold text-white">12%</span> this week. We've optimized your Uilora components for better visibility.
                                                </p>
                                                <div className="flex gap-3">
                                                    <button className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-indigo-600 shadow-xl shadow-black/10 hover:scale-105 transition-transform">
                                                        View Uilora Report
                                                    </button>
                                                    <button className="rounded-xl bg-indigo-600/50 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-600/70 transition-colors">
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </div>
                                        {/* Decor */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                                    </FrostCard>
                                </div>

                                {/* Quick Stat */}
                                <FrostCard delay={0.1} className="flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
                                            <Zap className="h-6 w-6" />
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-5 w-5" /></button>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                                        <h3 className="text-3xl font-bold text-slate-800">$124,592</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <StatPill val="12.5%" positive />
                                            <span className="text-xs text-slate-400">vs last month</span>
                                        </div>
                                    </div>
                                </FrostCard>

                                {/* Main Chart */}
                                <FrostCard delay={0.2} className="md:col-span-2 min-h-[350px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Uilora Performance</h3>
                                            <p className="text-sm text-slate-400">Revenue vs Active Users</p>
                                        </div>
                                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                                            {(['Daily', 'Monthly', 'Yearly'] as ChartRange[]).map((t) => (
                                                <button 
                                                    key={t} 
                                                    onClick={() => setChartRange(t)}
                                                    className={cn("px-3 py-1 text-xs font-semibold rounded-lg transition-all", chartRange === t ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600")}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData[chartRange]}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#fff", border: "none", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                                    itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                                                />
                                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                                <Area type="monotone" dataKey="users" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </FrostCard>

                                {/* Task List */}
                                <FrostCard delay={0.3} className="flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-slate-800">Tasks</h3>
                                        <button className="bg-black text-white rounded-full p-1"><Plus className="h-4 w-4" /></button>
                                    </div>
                                    <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                                        {[
                                            { title: "Review Q3 Report", time: "10:00 AM", done: false, tag: "Urgent" },
                                            { title: "Client Meeting", time: "11:30 AM", done: true, tag: "Call" },
                                            { title: "Update Figma", time: "2:00 PM", done: false, tag: "Design" },
                                            { title: "Team Sync", time: "4:00 PM", done: false, tag: "General" },
                                        ].map((task, i) => (
                                            <div key={i} className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-white/50 cursor-pointer">
                                                <button className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors", task.done ? "bg-black border-black text-white" : "border-slate-300 text-transparent hover:border-black")}>
                                                    <CheckCircle2 className="h-3 w-3" />
                                                </button>
                                                <div className="flex-1">
                                                    <p className={cn("text-sm font-semibold transition-all", task.done ? "text-slate-400 line-through" : "text-slate-800")}>{task.title}</p>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        {task.time}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] px-2 py-1 bg-slate-100 rounded-lg font-medium text-slate-500 group-hover:bg-white transition-colors">
                                                    {task.tag}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </FrostCard>

                                {/* Bottom Row - Activity */}
                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* Team Members */}
                                    <FrostCard delay={0.4} className="md:col-span-1">
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Team</h3>
                                        <div className="flex flex-col gap-4">
                                            {[1, 2, 3].map((u) => (
                                                <div key={u} className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u}`} className="h-10 w-10 rounded-full bg-slate-100" />
                                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">Designer {u}</p>
                                                        <p className="text-xs text-slate-400">Online now</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <button className="w-full mt-2 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                                                View All
                                            </button>
                                        </div>
                                    </FrostCard>

                                    {/* Server Status - Horizontal Bar */}
                                    <FrostCard delay={0.5} className="md:col-span-3 flex flex-col justify-center">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-slate-800">System Load</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-sm font-medium text-emerald-600">Operational</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                                    <span>US-East</span>
                                                    <span>45%</span>
                                                </div>
                                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "45%" }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className="h-full bg-indigo-500 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                                    <span>EU-West</span>
                                                    <span>22%</span>
                                                </div>
                                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "22%" }}
                                                        transition={{ duration: 1, delay: 0.7 }}
                                                        className="h-full bg-violet-500 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </FrostCard>
                                </div>
                            </div>
                        )}

                        {activeTab === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FrostCard delay={0.1} className="flex flex-col min-h-[400px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Uilora Acquisitions</h3>
                                            <p className="text-sm text-slate-400">Monthly new users</p>
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-5 w-5" /></button>
                                    </div>
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData['Monthly']}>
                                                <defs>
                                                    <linearGradient id="acqColor" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#fff", border: "none", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                                    itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                                                />
                                                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#acqColor)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </FrostCard>

                                <FrostCard delay={0.2} className="flex flex-col min-h-[400px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Uilora Traffic</h3>
                                            <p className="text-sm text-slate-400">Sources overview</p>
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-5 w-5" /></button>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center gap-6">
                                        {[
                                            { source: "Direct", percent: 45, color: "bg-indigo-500" },
                                            { source: "Organic Search", percent: 30, color: "bg-purple-500" },
                                            { source: "Referral", percent: 15, color: "bg-rose-500" },
                                            { source: "Social Media", percent: 10, color: "bg-emerald-500" }
                                        ].map((s, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-sm font-semibold text-slate-700">
                                                    <span>{s.source}</span>
                                                    <span>{s.percent}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${s.percent}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        className={cn("h-full rounded-full", s.color)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </FrostCard>
                            </div>
                        )}

                        {activeTab === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((u) => (
                                    <FrostCard key={u} delay={u * 0.1} className="flex flex-col items-center text-center">
                                        <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 mb-4 shadow-sm border-2 border-white">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Uilora${u}`} className="w-full h-full object-cover" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">Uilora User {u}</h3>
                                        <p className="text-sm text-slate-400 font-medium mb-6">Software Engineer</p>
                                        <div className="flex gap-3 w-full">
                                            <button className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors">
                                                Profile
                                            </button>
                                            <button className="flex-1 bg-slate-800 text-white py-2 rounded-xl text-sm font-semibold hover:bg-black transition-colors">
                                                Message
                                            </button>
                                        </div>
                                    </FrostCard>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
