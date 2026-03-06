"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
    label: string;
    value: string;
    trend: "up" | "down" | "stable";
    color: string;
    icon: string;
}

function MetricCard({ label, value, trend, color, icon }: MetricCardProps) {
    return (
        <div className="glass rounded-lg p-3 min-w-[130px]">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm">{icon}</span>
                <span
                    className="text-[8px] font-bold uppercase tracking-wider"
                    style={{ color }}
                >
                    {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}{" "}
                    {trend}
                </span>
            </div>
            <div className="text-lg font-bold terminal-text" style={{ color }}>
                {value}
            </div>
            <div className="text-[9px] text-white/30 mt-0.5">{label}</div>
        </div>
    );
}

// Simulated live metrics that tick
function useLiveValue(base: number, variance: number, interval = 2000) {
    const [value, setValue] = useState(base);
    useEffect(() => {
        const timer = setInterval(() => {
            setValue(base + Math.round((Math.random() - 0.5) * variance * 2));
        }, interval);
        return () => clearInterval(timer);
    }, [base, variance, interval]);
    return value;
}

export default function MetricsOverlay() {
    const cpuVal = useLiveValue(47, 8, 3000);
    const memVal = useLiveValue(62, 5, 4000);
    const netVal = useLiveValue(340, 60, 2500);
    const podVal = useLiveValue(27, 3, 5000);
    const reqVal = useLiveValue(1240, 200, 2000);
    const latVal = useLiveValue(23, 7, 3500);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3"
        >
            <MetricCard
                label="Cluster CPU"
                value={`${cpuVal}%`}
                trend={cpuVal > 55 ? "up" : cpuVal < 40 ? "down" : "stable"}
                color="#00f0ff"
                icon="🔲"
            />
            <MetricCard
                label="Memory Usage"
                value={`${memVal}%`}
                trend={memVal > 70 ? "up" : "stable"}
                color="#a855f7"
                icon="💾"
            />
            <MetricCard
                label="Network I/O"
                value={`${netVal} MB/s`}
                trend="stable"
                color="#39ff14"
                icon="📡"
            />
            <MetricCard
                label="Active Pods"
                value={`${podVal}`}
                trend={podVal > 28 ? "up" : podVal < 25 ? "down" : "stable"}
                color="#FF9900"
                icon="📦"
            />
            <MetricCard
                label="Requests/sec"
                value={`${reqVal}`}
                trend="up"
                color="#4361ee"
                icon="⚡"
            />
            <MetricCard
                label="Avg Latency"
                value={`${latVal}ms`}
                trend={latVal > 28 ? "up" : "stable"}
                color="#ff6b6b"
                icon="⏱️"
            />
        </motion.div>
    );
}
