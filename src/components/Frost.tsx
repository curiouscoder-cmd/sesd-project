"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Global CSS for Mesh Gradient ---
export const MeshGradient = () => (
    <style jsx global>{`
    @keyframes float {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    
    .mesh-bg {
      background-color: #f8fafc; /* Slate 50 */
      position: fixed;
      inset: 0;
      z-index: -10;
      overflow: hidden;
    }
    
    .blob {
      position: absolute;
      filter: blur(80px);
      opacity: 0.6;
      animation: float 10s infinite ease-in-out;
    }
    .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: #bfdbfe; animation-delay: 0s; } /* Blue */
    .blob-2 { bottom: -10%; right: -10%; width: 50vw; height: 50vw; background: #e9d5ff; animation-delay: 2s; } /* Purple */
    .blob-3 { top: 40%; left: 40%; width: 30vw; height: 30vw; background: #fecaca; animation-delay: 4s; } /* Red */
  `}</style>
);

// --- Mock Data ---
export const chartData = {
    Daily: [
        { name: "Mon", revenue: 4000, users: 2400 },
        { name: "Tue", revenue: 3000, users: 1398 },
        { name: "Wed", revenue: 2000, users: 9800 },
        { name: "Thu", revenue: 2780, users: 3908 },
        { name: "Fri", revenue: 1890, users: 4800 },
        { name: "Sat", revenue: 2390, users: 3800 },
        { name: "Sun", revenue: 3490, users: 4300 },
    ],
    Monthly: [
        { name: "Jan", revenue: 12000, users: 8400 },
        { name: "Feb", revenue: 15000, users: 9398 },
        { name: "Mar", revenue: 18000, users: 12800 },
        { name: "Apr", revenue: 14780, users: 10908 },
        { name: "May", revenue: 21890, users: 14800 },
        { name: "Jun", revenue: 25390, users: 16800 },
        { name: "Jul", revenue: 31490, users: 18300 },
    ],
    Yearly: [
        { name: "2018", revenue: 140000, users: 52400 },
        { name: "2019", revenue: 183000, users: 61398 },
        { name: "2020", revenue: 212000, users: 89800 },
        { name: "2021", revenue: 282780, users: 103908 },
        { name: "2022", revenue: 351890, users: 124800 },
        { name: "2023", revenue: 412390, users: 153800 },
        { name: "2024", revenue: 503490, users: 184300 },
    ]
};

// --- Components ---

export function FrostCard({ children, className, delay = 0 }: any) {
    return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4, ease: "easeOut" }}
        className={cn(
            "relative overflow-hidden rounded-[32px] border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-xl transition-all hover:bg-white/60 hover:shadow-md",
            className
        )}
    >
        {children}
    </motion.div>
    );
}

export function NavItem({ icon: Icon, active, onClick }: any) {
    return (
    <button
        onClick={onClick}
        className={cn(
            "relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
            active
                ? "bg-black text-white shadow-lg shadow-black/20"
                : "text-slate-500 hover:bg-white/50 hover:text-black"
        )}
    >
        <Icon className="h-5 w-5" />
        {active && (
            <motion.div
                layoutId="active-dot"
                className="absolute -bottom-2 h-1 w-1 rounded-full bg-black"
            />
        )}
    </button>
    );
}

export function StatPill({ val, positive }: { val: string; positive?: boolean }) {
    return (
    <div className={cn(
        "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
        positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
    )}>
        {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3 rotate-180" />}
        {val}
    </div>
    );
}
