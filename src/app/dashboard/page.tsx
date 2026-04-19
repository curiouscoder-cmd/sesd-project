"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart2,
  Bell,
  CheckCircle2,
  Clock,
  Command,
  Home,
  Mail,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { FrostCard, MeshGradient, NavItem, StatPill, chartData, type ChartRange } from "@/components/Frost";
import { cn } from "@/lib/utils";

type TabId = "overview" | "groups" | "activity" | "reminders";

type DashboardTab = {
  id: TabId;
  label: string;
  icon: LucideIcon;
  heading: string;
  subheading: string;
};

type GroupCard = {
  name: string;
  total: number;
  pending: number;
  members: string[];
  status: string;
  completion: number;
};

type Reminder = {
  person: string;
  amount: number;
  note: string;
  due: string;
  priority: "High" | "Medium" | "Low";
};

const tabs: DashboardTab[] = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    heading: "Expense overview",
    subheading: "Track balances, spend trends, and what still needs settlement.",
  },
  {
    id: "groups",
    label: "Groups",
    icon: Users,
    heading: "Active groups",
    subheading: "Keep every trip, flat, and event organized without digging through chats.",
  },
  {
    id: "activity",
    label: "Activity",
    icon: BarChart2,
    heading: "Recent activity",
    subheading: "See what changed, who paid, and which balances moved today.",
  },
  {
    id: "reminders",
    label: "Reminders",
    icon: Mail,
    heading: "Reminder center",
    subheading: "Send softer nudges with context instead of awkward follow-ups.",
  },
];

const metrics = [
  { label: "Total tracked", value: 284600, delta: "18.4%" },
  { label: "Still to settle", value: 42840, delta: "6.2%" },
  { label: "This week paid back", value: 69200, delta: "12.1%" },
];

const groups: GroupCard[] = [
  {
    name: "Goa Trip",
    total: 92800,
    pending: 12400,
    members: ["NJ", "RK", "SP", "AM", "DV"],
    status: "2 pending payments",
    completion: 78,
  },
  {
    name: "Flat Expenses",
    total: 41250,
    pending: 5200,
    members: ["NJ", "AR", "KS"],
    status: "Groceries due tomorrow",
    completion: 88,
  },
  {
    name: "Hackathon Crew",
    total: 18640,
    pending: 7640,
    members: ["NJ", "PM", "VS", "RA"],
    status: "Travel reimbursements open",
    completion: 59,
  },
  {
    name: "Birthday Dinner",
    total: 12980,
    pending: 0,
    members: ["NJ", "SM", "KA", "TR"],
    status: "Fully settled",
    completion: 100,
  },
];

const upcomingReminders: Reminder[] = [
  { person: "Riya", amount: 3200, note: "Villa booking share", due: "Today, 7:00 PM", priority: "High" },
  { person: "Aman", amount: 1150, note: "Airport cab split", due: "Tomorrow, 10:00 AM", priority: "Medium" },
  { person: "Kashish", amount: 4800, note: "April rent adjustment", due: "Apr 22, 9:00 AM", priority: "High" },
  { person: "Vidit", amount: 640, note: "Snacks and supplies", due: "Apr 23, 6:30 PM", priority: "Low" },
];

const activityFeed = [
  { title: "You added `Groceries` to Flat Expenses", time: "12 min ago", meta: "Split equally among 3 people" },
  { title: "Riya settled INR 2,400 for Goa Trip", time: "38 min ago", meta: "Outstanding balance dropped to INR 12,400" },
  { title: "A new member joined Hackathon Crew", time: "1 hr ago", meta: "4 active members in this group now" },
  { title: "Birthday Dinner was marked settled", time: "Today", meta: "All balances cleared successfully" },
];

const quickTasks = [
  { title: "Review April flat expenses", done: false, time: "Before 6 PM" },
  { title: "Send Goa Trip reminder batch", done: true, time: "Completed" },
  { title: "Add hackathon reimbursements", done: false, time: "Tonight" },
  { title: "Archive settled dinner group", done: false, time: "Tomorrow" },
];

const teamMembers = [
  { name: "Riya Kapoor", role: "Trip organizer", initials: "RK", tone: "bg-amber-100" },
  { name: "Aman Mehta", role: "Flatmate", initials: "AM", tone: "bg-sky-100" },
  { name: "Vidit Sharma", role: "Hackathon crew", initials: "VS", tone: "bg-rose-100" },
];

const settlementLoad = [
  { label: "Goa Trip", value: 68, color: "bg-indigo-500" },
  { label: "Flat Expenses", value: 44, color: "bg-violet-500" },
  { label: "Hackathon Crew", value: 29, color: "bg-cyan-500" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const compactCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

function AvatarStack({ members }: { members: string[] }) {
  return (
    <div className="flex items-center">
      {members.map((member, index) => (
        <div
          key={`${member}-${index}`}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-slate-700 shadow-sm",
            index % 3 === 0 && "bg-amber-100",
            index % 3 === 1 && "bg-sky-100",
            index % 3 === 2 && "bg-rose-100",
            index !== 0 && "-ml-3",
          )}
        >
          {member}
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [chartRange, setChartRange] = useState<ChartRange>("Monthly");
  const [isChartReady, setIsChartReady] = useState(false);
  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  useEffect(() => {
    setIsChartReady(true);
  }, []);

  return (
    <div className="relative min-h-screen text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      <MeshGradient />
      <div className="mesh-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <motion.aside
          initial={{ x: -36, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden md:flex md:w-24 md:flex-col md:items-center md:justify-between md:rounded-[36px] md:border md:border-white/70 md:bg-white/35 md:py-8 md:backdrop-blur-2xl md:shadow-[0_20px_60px_rgba(99,102,241,0.08)]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="flex flex-col gap-4">
            {tabs.map((tab) => (
              <NavItem
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>

          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-slate-500 transition hover:rotate-90 hover:text-slate-900">
            <Settings className="h-5 w-5" />
          </button>
        </motion.aside>

        <main className="flex min-w-0 flex-1 flex-col gap-6">
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-[32px] border border-white/70 bg-white/50 px-5 py-4 shadow-[0_20px_60px_rgba(99,102,241,0.08)] backdrop-blur-2xl sm:px-6"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2 md:hidden">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-semibold transition",
                        activeTab === tab.id
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                          : "border border-white/70 bg-white/70 text-slate-600",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <h1 className="text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-[2rem]">
                    {activeTabMeta.label}
                  </h1>

                  <div className="hidden items-center gap-2 rounded-full border border-white/80 bg-white/65 px-4 py-3 text-sm text-slate-500 shadow-inner lg:flex">
                    <Search className="h-4 w-4" />
                    <span className="pr-12">Search analytics...</span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-slate-500 shadow-sm">
                      <Command className="h-3 w-3" />
                      K
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <button className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white/85 text-slate-600 shadow-sm transition hover:scale-105 hover:text-slate-900">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border border-white bg-rose-500" />
                  </button>

                  <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/85 px-2 py-1.5 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 text-sm font-bold text-slate-700">
                      ND
                    </div>
                    <div className="pr-3 leading-tight">
                      <p className="text-sm font-bold text-slate-900">Nitya Jain</p>
                      <p className="text-xs text-slate-400">Pro Plan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.header>

          <div className="flex-1 pb-4">
            {activeTab === "overview" ? (
              <div className="grid gap-6 xl:grid-cols-[2.15fr_1fr]">
                <FrostCard className="min-h-[240px] border-white/50 bg-white/30 p-0 xl:col-span-1">
                  <div className="relative h-full overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 p-8 text-white shadow-[0_30px_80px_rgba(129,91,255,0.35)]">
                    <div className="absolute inset-y-0 right-0 w-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_62%)]" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/15 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-md">
                        SplitCircle Balance Intelligence
                      </div>

                      <h2 className="mt-7 max-w-xl text-4xl font-bold tracking-tight">
                        Welcome back, Nitya.
                      </h2>
                      <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
                        Your shared expenses are under control this week. Pending balances are down and the biggest groups are closing faster.
                      </p>

                      <div className="mt-8 flex flex-wrap gap-4">
                        <button className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-indigo-600 shadow-xl shadow-black/10 transition hover:scale-[1.02]">
                          View all balances
                        </button>
                        <button className="rounded-2xl bg-white/12 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/18">
                          Add new expense
                        </button>
                      </div>
                    </div>
                  </div>
                </FrostCard>

                <FrostCard delay={0.1} className="flex min-h-[240px] flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
                      <Zap className="h-5 w-5" />
                    </div>
                    <button className="text-slate-400 transition hover:text-slate-700">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-10">
                    <p className="text-sm font-medium text-slate-400">Outstanding balance</p>
                    <h3 className="mt-3 text-5xl font-black tracking-tight text-slate-950">{formatCurrency(124592)}</h3>
                    <div className="mt-3 flex items-center gap-2">
                      <StatPill val="12.5%" positive />
                      <span className="text-xs text-slate-400">lower than last month</span>
                    </div>
                  </div>
                </FrostCard>

                <FrostCard delay={0.15} className="min-h-[390px] xl:col-span-1">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">SplitCircle Performance</h3>
                      <p className="text-sm text-slate-400">Spending vs Settlements</p>
                    </div>

                    <div className="inline-flex rounded-2xl bg-slate-100/90 p-1">
                      {(["Daily", "Monthly", "Yearly"] as ChartRange[]).map((range) => (
                        <button
                          key={range}
                          onClick={() => setChartRange(range)}
                          className={cn(
                            "rounded-xl px-4 py-2 text-xs font-semibold transition",
                            chartRange === range ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-700",
                          )}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 h-[320px] w-full">
                    {isChartReady ? (
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
                        <AreaChart data={chartData[chartRange]}>
                          <defs>
                            <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4aa8" stopOpacity={0.18} />
                              <stop offset="95%" stopColor="#ef4aa8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="settledGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.16} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" vertical={false} />
                          <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                          />
                          <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${compactCurrency(value)}`}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "16px",
                              border: "1px solid rgba(255,255,255,0.8)",
                              background: "rgba(255,255,255,0.92)",
                              boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
                            }}
                            formatter={(value, name) => {
                              const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                              return [
                                formatCurrency(numericValue),
                                name === "totalSpent" ? "Total spent" : "Total settled",
                              ];
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="totalSpent"
                            stroke="#ef4aa8"
                            strokeWidth={3}
                            fill="url(#spentGradient)"
                          />
                          <Area
                            type="monotone"
                            dataKey="totalSettled"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fill="url(#settledGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-[24px] bg-gradient-to-br from-slate-50 to-white">
                        <div className="h-32 w-full rounded-[20px] bg-[linear-gradient(90deg,rgba(148,163,184,0.08),rgba(99,102,241,0.12),rgba(6,182,212,0.08))]" />
                      </div>
                    )}
                  </div>
                </FrostCard>

                <FrostCard delay={0.2} className="min-h-[390px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">Tasks</h3>
                      <p className="text-sm text-slate-400">Next actions for the group</p>
                    </div>
                    <button className="rounded-full bg-slate-900 p-2 text-white">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-7 space-y-5">
                    {[
                      { title: "Review Goa villa split", time: "10:00 AM", tag: "Urgent", done: false },
                      { title: "Settle flat groceries", time: "11:30 AM", tag: "Bills", done: true },
                      { title: "Update hackathon transport", time: "2:00 PM", tag: "Travel", done: false },
                      { title: "Ping pending members", time: "4:00 PM", tag: "Reminder", done: false },
                    ].map((task) => (
                      <div key={task.title} className="group flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-1 flex h-7 w-7 items-center justify-center rounded-full border-2 transition",
                            task.done
                              ? "border-slate-950 bg-slate-950 text-white"
                              : "border-slate-300 text-transparent group-hover:border-slate-700",
                          )}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1">
                          <p className={cn("font-semibold", task.done ? "text-slate-400 line-through" : "text-slate-900")}>
                            {task.title}
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="h-3 w-3" />
                            {task.time}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                          {task.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </FrostCard>

                <div className="grid gap-6 xl:col-span-2 xl:grid-cols-[0.9fr_1.1fr]">
                  <FrostCard delay={0.25}>
                    <h3 className="text-xl font-bold text-slate-950">Team</h3>
                    <div className="mt-6 space-y-5">
                      {teamMembers.map((member) => (
                        <div key={member.name} className="flex items-center gap-4">
                          <div className={cn("relative flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-slate-700", member.tone)}>
                            {member.initials}
                            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{member.name}</p>
                            <p className="text-sm text-slate-400">{member.role}</p>
                          </div>
                        </div>
                      ))}

                      <button className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                        View all members
                      </button>
                    </div>
                  </FrostCard>

                  <FrostCard delay={0.3}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-950">Settlement Load</h3>
                        <p className="text-sm text-slate-400">Where the remaining work is concentrated</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-emerald-600">Operational</span>
                      </div>
                    </div>

                    <div className="mt-7 space-y-5">
                      {settlementLoad.map((item) => (
                        <div key={item.label}>
                          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-500">
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={{ duration: 0.9 }}
                              className={cn("h-full rounded-full", item.color)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </FrostCard>
                </div>
              </div>
            ) : null}

            {activeTab === "groups" ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {groups.map((group, index) => (
                  <FrostCard key={group.name} delay={index * 0.08}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          {group.members.length} members
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-slate-950">{group.name}</h2>
                        <p className="mt-2 text-sm text-slate-500">{group.status}</p>
                      </div>
                      <button className="text-slate-400 transition hover:text-slate-700">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[24px] bg-slate-50/90 p-4">
                        <p className="text-sm text-slate-500">Tracked total</p>
                        <p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(group.total)}</p>
                      </div>
                      <div className="rounded-[24px] bg-slate-50/90 p-4">
                        <p className="text-sm text-slate-500">Pending total</p>
                        <p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(group.pending)}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <AvatarStack members={group.members} />
                      <StatPill val={`${group.completion}% settled`} positive={group.completion >= 80} />
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${group.completion}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-slate-900 via-indigo-500 to-cyan-400"
                      />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800">
                        View balances
                      </button>
                      <button className="rounded-2xl border border-white/80 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white">
                        Add expense
                      </button>
                    </div>
                  </FrostCard>
                ))}
              </div>
            ) : null}

            {activeTab === "activity" ? (
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <FrostCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">Activity feed</h2>
                      <p className="text-sm text-slate-500">A cleaner log of what happened across all your groups.</p>
                    </div>
                    <button className="rounded-full bg-slate-900 p-2 text-white">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    {activityFeed.map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="rounded-[24px] border border-white/80 bg-white/75 p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                            <BarChart2 className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{item.title}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-500">{item.meta}</p>
                          </div>
                          <span className="text-xs font-medium text-slate-400">{item.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </FrostCard>

                <div className="grid gap-6">
                  <FrostCard delay={0.1}>
                    <h3 className="text-lg font-bold text-slate-950">This week at a glance</h3>
                    <div className="mt-5 grid gap-3">
                      {[
                        { label: "Expenses added", value: "27" },
                        { label: "Settlements completed", value: "14" },
                        { label: "Pending reminders", value: "6" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-[22px] bg-slate-50/90 px-4 py-3">
                          <span className="text-sm text-slate-500">{item.label}</span>
                          <span className="text-lg font-bold text-slate-950">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </FrostCard>

                  <FrostCard delay={0.15}>
                    <h3 className="text-lg font-bold text-slate-950">Focus next</h3>
                    <div className="mt-5 space-y-3">
                      {quickTasks.map((task) => (
                        <div key={task.title} className="rounded-[22px] border border-white/80 bg-white/70 p-4">
                          <p className="font-semibold text-slate-900">{task.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{task.time}</p>
                        </div>
                      ))}
                    </div>
                  </FrostCard>
                </div>
              </div>
            ) : null}

            {activeTab === "reminders" ? (
              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <FrostCard className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-4 py-3">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search reminders or member names"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    {upcomingReminders.map((reminder, index) => (
                      <motion.button
                        key={`${reminder.person}-${reminder.note}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 }}
                        className={cn(
                          "w-full rounded-[24px] border p-4 text-left transition",
                          index === 0
                            ? "border-white bg-white shadow-sm"
                            : "border-transparent bg-white/45 hover:border-white/80 hover:bg-white/70",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{reminder.person}</p>
                            <p className="mt-1 text-sm text-slate-500">{reminder.note}</p>
                          </div>
                          <span className="text-xs font-medium text-slate-400">{reminder.due}</span>
                        </div>
                        <p className="mt-4 text-sm font-bold text-slate-900">{formatCurrency(reminder.amount)}</p>
                      </motion.button>
                    ))}
                  </div>
                </FrostCard>

                <FrostCard>
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-lg font-bold text-slate-700">
                        R
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-950">Reminder draft for Riya</h2>
                        <p className="mt-1 text-sm text-slate-500">Villa booking share for Goa Trip</p>
                      </div>
                    </div>
                    <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-slate-500 transition hover:text-slate-900">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="py-6 text-sm leading-7 text-slate-600">
                    <p>Hi Riya,</p>
                    <p className="mt-4">
                      Quick reminder that your share for the Goa villa booking is still pending. The remaining amount is
                      <span className="font-semibold text-slate-900"> {formatCurrency(3200)}</span>.
                    </p>
                    <p className="mt-4">
                      I’ve kept the numbers updated in the dashboard so you can cross-check the split before paying. Once this is settled, the trip group will be almost completely clear.
                    </p>
                    <div className="mt-6 rounded-[24px] bg-slate-50/90 p-5">
                      <p className="font-semibold text-slate-900">Suggested message tone</p>
                      <p className="mt-2 text-slate-500">
                        Friendly, direct, and contextual. The app should feel helpful, not passive-aggressive.
                      </p>
                    </div>
                    <p className="mt-6">Thanks!</p>
                  </div>

                  <div className="flex flex-wrap gap-3 border-t border-slate-200/60 pt-5">
                    <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800">
                      Send reminder
                    </button>
                    <button className="rounded-2xl border border-white/80 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-white">
                      Edit message
                    </button>
                  </div>
                </FrostCard>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
