"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ChartRange = "Daily" | "Monthly" | "Yearly";

export type TrendPoint = {
  name: string;
  totalSpent: number;
  totalSettled: number;
};

export const chartData: Record<ChartRange, TrendPoint[]> = {
  Daily: [
    { name: "Mon", totalSpent: 2600, totalSettled: 1800 },
    { name: "Tue", totalSpent: 3400, totalSettled: 2200 },
    { name: "Wed", totalSpent: 2100, totalSettled: 2700 },
    { name: "Thu", totalSpent: 3900, totalSettled: 2500 },
    { name: "Fri", totalSpent: 4700, totalSettled: 3200 },
    { name: "Sat", totalSpent: 5300, totalSettled: 3600 },
    { name: "Sun", totalSpent: 4100, totalSettled: 3400 },
  ],
  Monthly: [
    { name: "Jan", totalSpent: 12000, totalSettled: 7600 },
    { name: "Feb", totalSpent: 14800, totalSettled: 9100 },
    { name: "Mar", totalSpent: 16500, totalSettled: 11400 },
    { name: "Apr", totalSpent: 18200, totalSettled: 12600 },
    { name: "May", totalSpent: 22600, totalSettled: 14800 },
    { name: "Jun", totalSpent: 24100, totalSettled: 17100 },
    { name: "Jul", totalSpent: 26500, totalSettled: 19400 },
  ],
  Yearly: [
    { name: "2020", totalSpent: 98000, totalSettled: 72000 },
    { name: "2021", totalSpent: 136000, totalSettled: 101000 },
    { name: "2022", totalSpent: 173000, totalSettled: 129000 },
    { name: "2023", totalSpent: 218000, totalSettled: 164000 },
    { name: "2024", totalSpent: 266000, totalSettled: 209000 },
    { name: "2025", totalSpent: 311000, totalSettled: 246000 },
    { name: "2026", totalSpent: 347000, totalSettled: 291000 },
  ],
};

export function MeshGradient() {
  return (
    <style jsx global>{`
      @keyframes float {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(30px, -45px) scale(1.08);
        }
        66% {
          transform: translate(-24px, 18px) scale(0.92);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }

      .mesh-bg {
        position: fixed;
        inset: 0;
        z-index: -20;
        overflow: hidden;
        background:
          radial-gradient(circle at top, rgba(255, 255, 255, 0.75), transparent 36%),
          linear-gradient(180deg, #f7f8fc 0%, #eef4ff 48%, #f7fbff 100%);
      }

      .blob {
        position: absolute;
        border-radius: 9999px;
        filter: blur(90px);
        opacity: 0.62;
        animation: float 16s infinite ease-in-out;
      }

      .blob-1 {
        top: -10%;
        left: -10%;
        width: 46vw;
        height: 46vw;
        background: rgba(96, 165, 250, 0.45);
      }

      .blob-2 {
        right: -8%;
        bottom: -12%;
        width: 42vw;
        height: 42vw;
        background: rgba(192, 132, 252, 0.34);
        animation-delay: 2.5s;
      }

      .blob-3 {
        top: 24%;
        left: 40%;
        width: 28vw;
        height: 28vw;
        background: rgba(251, 191, 36, 0.28);
        animation-delay: 5s;
      }
    `}</style>
  );
}

type FrostCardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function FrostCard({ children, className, delay = 0 }: FrostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-white/70 bg-white/45 p-6 shadow-[0_20px_60px_rgba(99,102,241,0.08)] backdrop-blur-2xl transition-all duration-300 hover:border-white hover:bg-white/60 hover:shadow-[0_25px_70px_rgba(99,102,241,0.12)]",
        className,
      )}
    >
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      {children}
    </motion.div>
  );
}

type NavItemProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
        active
          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
          : "text-slate-500 hover:bg-white/60 hover:text-slate-900",
      )}
    >
      <Icon className="h-5 w-5" />
      {active ? (
        <motion.div layoutId="frost-nav-indicator" className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-slate-900" />
      ) : null}
      <span className="pointer-events-none absolute left-[calc(100%+12px)] hidden whitespace-nowrap rounded-full border border-white/80 bg-white/90 px-2 py-1 text-xs font-semibold text-slate-600 shadow-lg group-hover:block">
        {label}
      </span>
    </button>
  );
}

type StatPillProps = {
  val: string;
  positive?: boolean;
};

export function StatPill({ val, positive = true }: StatPillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
      )}
    >
      {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      <span>{val}</span>
    </div>
  );
}
