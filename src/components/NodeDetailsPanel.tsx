"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MetricBarProps {
    label: string;
    value: number;
    max: number;
    color: string;
    unit?: string;
}

function MetricBar({ label, value, max, color, unit = "%" }: MetricBarProps) {
    const pct = Math.min((value / max) * 100, 100);
    const isHigh = pct > 75;

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center">
                <span className="text-[9px] text-white/40 uppercase tracking-wider">{label}</span>
                <span
                    className="text-[10px] font-bold terminal-text"
                    style={{ color: isHigh ? "#ff6b6b" : color }}
                >
                    {value}{unit}
                </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        background: isHigh
                            ? `linear-gradient(90deg, ${color}, #ff6b6b)`
                            : color,
                        boxShadow: `0 0 8px ${color}40`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

interface NodeDetailsPanelProps {
    visible: boolean;
    title: string;
    subtitle?: string;
    details?: string[];
    metrics?: { label: string; value: number; max: number; color: string; unit?: string }[];
    configItems?: string[];
    statusColor?: string;
    onClose?: () => void;
}

export default function NodeDetailsPanel({
    visible,
    title,
    subtitle,
    details,
    metrics,
    configItems,
    statusColor = "#00f0ff",
}: NodeDetailsPanelProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="glass-strong rounded-xl p-4 min-w-[220px] max-w-[260px] pointer-events-auto"
                    style={{ boxShadow: `0 0 30px ${statusColor}10` }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: statusColor, boxShadow: `0 0 8px ${statusColor}` }}
                        />
                        <div>
                            <h4 className="text-xs font-bold text-white/90">{title}</h4>
                            {subtitle && (
                                <p className="text-[9px] text-white/40 terminal-text">{subtitle}</p>
                            )}
                        </div>
                    </div>

                    {/* Details list */}
                    {details && details.length > 0 && (
                        <div className="mb-3 space-y-1">
                            {details.map((d, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <span className="text-[8px]" style={{ color: statusColor }}>▸</span>
                                    <span className="text-[10px] text-white/50">{d}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Metrics */}
                    {metrics && metrics.length > 0 && (
                        <div className="space-y-2 mb-3">
                            {metrics.map((m, i) => (
                                <MetricBar key={i} {...m} />
                            ))}
                        </div>
                    )}

                    {/* Config */}
                    {configItems && configItems.length > 0 && (
                        <div className="border-t border-white/5 pt-2 mt-2">
                            <span className="text-[8px] text-white/25 uppercase tracking-wider block mb-1">
                                Configuration
                            </span>
                            <div className="terminal-text text-[9px] text-white/35 space-y-0.5">
                                {configItems.map((c, i) => (
                                    <div key={i}>
                                        <span className="text-white/15">$</span> {c}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
