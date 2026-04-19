"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Users, Zap } from "lucide-react";

import { FrostCard, MeshGradient, StatPill } from "@/components/Frost";

const productHighlights = [
  {
    title: "Instant group splits",
    description: "Create a trip, flat, or event group and split bills without the spreadsheet chaos.",
    icon: Users,
  },
  {
    title: "Clear balances",
    description: "See who owes whom, what is settled, and what still needs attention in one place.",
    icon: Zap,
  },
  {
    title: "Friendly nudges",
    description: "Keep reminders simple and low-friction so the app helps the group, not the drama.",
    icon: CheckCircle2,
  },
];

const sampleExpenses = [
  { title: "Goa villa booking", amount: "INR 18,400", meta: "Split across 6 friends" },
  { title: "Friday groceries", amount: "INR 3,250", meta: "2 people still owe you" },
  { title: "Cab to airport", amount: "INR 1,180", meta: "Fully settled" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      <MeshGradient />
      <div className="mesh-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-[28px] border border-white/70 bg-white/45 px-5 py-4 shadow-[0_20px_60px_rgba(99,102,241,0.08)] backdrop-blur-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">SplitCircle</p>
              <p className="text-xs text-slate-500">Expense sharing for groups that move fast</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white"
            >
              Live dashboard
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.header>

        <main className="flex flex-1 items-center py-8 lg:py-12">
          <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.section
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Designed with the Frost UI feel, rebuilt for this product
              </div>

              <h1 className="max-w-3xl text-5xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
                Split expenses without making the frontend look like a group project disaster.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                SplitCircle helps roommates, trips, events, and teams track shared costs, settle faster, and keep every balance visible in one elegant workspace.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="rounded-2xl border border-white/80 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-xl">
                  <p className="text-sm text-slate-500">This month</p>
                  <div className="mt-1 flex items-center gap-3">
                    <p className="text-xl font-bold text-slate-900">INR 2.84L tracked</p>
                    <StatPill val="18% up" positive />
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {productHighlights.map(({ title, description, icon: Icon }, index) => (
                  <FrostCard key={title} delay={0.15 + index * 0.1} className="rounded-[28px] p-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                  </FrostCard>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-stretch"
            >
              <FrostCard className="w-full rounded-[36px] p-4 sm:p-6">
                <div className="rounded-[30px] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-700 p-6 text-white shadow-2xl shadow-indigo-500/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white/70">Group snapshot</p>
                      <h2 className="mt-2 text-3xl font-bold">Weekend in Jaipur</h2>
                    </div>
                    <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-md">
                      6 members
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-white/70">Outstanding balance</p>
                      <p className="mt-2 text-3xl font-bold">INR 24,860</p>
                      <p className="mt-2 text-sm text-emerald-300">4 expenses added today</p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-white/70">Fastest settlement path</p>
                      <p className="mt-2 text-lg font-semibold">3 transfers instead of 8</p>
                      <p className="mt-2 text-sm text-white/70">Less chasing, less noise</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[28px] border border-white/80 bg-white/70 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Recent expenses</p>
                        <h3 className="text-xl font-bold text-slate-900">Clean, readable activity</h3>
                      </div>
                      <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Live
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {sampleExpenses.map((expense) => (
                        <div
                          key={expense.title}
                          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                        >
                          <div>
                            <p className="font-semibold text-slate-900">{expense.title}</p>
                            <p className="text-sm text-slate-500">{expense.meta}</p>
                          </div>
                          <p className="text-sm font-bold text-slate-900">{expense.amount}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/80 bg-white/70 p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Why it works</p>
                    <div className="mt-4 space-y-4">
                      {[
                        "Designed for mobile and desktop from the start",
                        "Built around actual expense splitting flows",
                        "Glassmorphism kept useful instead of noisy",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <p className="text-sm leading-6 text-slate-600">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FrostCard>
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  );
}
