"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp } from "@/animations/scrollAnimations";
import NodeDetailsPanel from "./NodeDetailsPanel";
import {
    infraNodes,
    infraConnections,
    infraRegions,
    providerMetrics,
    InfraNode,
} from "@/lib/cloudInfrastructure";

type Provider = "all" | "aws" | "azure" | "gcp";

/* ── Animated data packet ─────────────────────────────── */
function DataPacket({
    x1, y1, x2, y2, color, delay,
}: {
    x1: number; y1: number; x2: number; y2: number;
    color: string; delay: number;
}) {
    return (
        <motion.circle
            r="2"
            fill={color}
            filter="url(#infraGlow)"
            initial={{ opacity: 0 }}
            animate={{
                cx: [`${x1}%`, `${x2}%`],
                cy: [`${y1}%`, `${y2}%`],
                opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
                duration: 2.5 + Math.random() * 2,
                delay,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
}

/* ── Service node ─────────────────────────────────────── */
function ServiceNode({
    node,
    isActive,
    isFiltered,
    onHover,
    onClick,
}: {
    node: InfraNode;
    isActive: boolean;
    isFiltered: boolean;
    onHover: (id: string | null) => void;
    onClick: (id: string) => void;
}) {
    return (
        <motion.div
            className="absolute cursor-pointer group"
            style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isActive ? 20 : 5,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: isFiltered ? 0.15 : 1,
                scale: isFiltered ? 0.8 : 1,
            }}
            transition={{ duration: 0.4 }}
            onMouseEnter={() => !isFiltered && onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => !isFiltered && onClick(node.id)}
            whileHover={isFiltered ? {} : { scale: 1.15 }}
        >
            {/* Glow */}
            <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                    background: `radial-gradient(circle, ${node.color}30, transparent 70%)`,
                    transform: "scale(3)",
                }}
                animate={{
                    opacity: isActive ? [0.4, 0.7, 0.4] : [0.05, 0.15, 0.05],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
            />

            {/* Card */}
            <div
                className={`relative glass-strong rounded-xl px-3 py-2 flex items-center gap-2 transition-all duration-300 ${isActive ? "outline outline-1" : ""
                    }`}
                style={{
                    outlineColor: isActive ? node.color : undefined,
                    boxShadow: isActive ? `0 0 20px ${node.color}30` : undefined,
                }}
            >
                <span className="text-base shrink-0">{node.icon}</span>
                <div className="min-w-0">
                    <div className="text-[10px] font-bold text-white/90 truncate">
                        {node.service}
                    </div>
                    <div
                        className="text-[8px] uppercase tracking-wider truncate"
                        style={{ color: node.color }}
                    >
                        {node.provider}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ── Region boundary ──────────────────────────────────── */
function RegionBoundary({
    region,
    isActive,
}: {
    region: (typeof infraRegions)[0];
    isActive: boolean;
}) {
    return (
        <div
            className="absolute rounded-2xl transition-all duration-500 pointer-events-none"
            style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                width: `${region.width}%`,
                height: `${region.height}%`,
                background: isActive ? region.bgColor : "transparent",
                border: `1px dashed ${isActive ? region.borderColor : "rgba(255,255,255,0.03)"}`,
            }}
        >
            <span
                className="absolute -top-2.5 left-4 px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase"
                style={{
                    color: region.color,
                    background: "var(--background)",
                    opacity: isActive ? 0.8 : 0.3,
                }}
            >
                {region.label}
            </span>
        </div>
    );
}

/* ── Provider stats ───────────────────────────────────── */
function ProviderStats({
    provider,
    active,
}: {
    provider: "aws" | "azure" | "gcp";
    active: boolean;
}) {
    const data = providerMetrics[provider];
    const colors = { aws: "#FF9900", azure: "#0078D4", gcp: "#4285F4" };
    const color = colors[provider];

    return (
        <motion.div
            layout
            className={`glass rounded-xl p-3 transition-all duration-300 ${active ? "outline outline-1" : "opacity-50"
                }`}
            style={{
                outlineColor: active ? color : undefined,
                boxShadow: active ? `0 0 20px ${color}15` : undefined,
            }}
        >
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color }}>
                {provider.toUpperCase()}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 terminal-text text-[9px]">
                <span className="text-white/30">Instances</span>
                <span className="text-white/60 text-right">{data.instances}</span>
                <span className="text-white/30">Containers</span>
                <span className="text-white/60 text-right">{data.containers}</span>
                <span className="text-white/30">Cost</span>
                <span className="text-right" style={{ color }}>{data.cost}</span>
                <span className="text-white/30">Uptime</span>
                <span className="text-neon-green text-right">{data.uptime}</span>
            </div>
        </motion.div>
    );
}

/* ── Main component ───────────────────────────────────── */
export default function InfrastructureMap() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
    const [activeProvider, setActiveProvider] = useState<Provider>("all");
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const activeNodeData = useMemo(
        () => infraNodes.find((n) => n.id === (hoveredNode || selectedNode)),
        [hoveredNode, selectedNode]
    );

    const handleNodeClick = useCallback((id: string) => {
        setSelectedNode((prev) => (prev === id ? null : id));
    }, []);

    const filteredConnections = useMemo(
        () =>
            infraConnections.filter((c) => {
                if (activeProvider === "all") return true;
                const from = infraNodes.find((n) => n.id === c.from);
                const to = infraNodes.find((n) => n.id === c.to);
                return from?.provider === activeProvider || to?.provider === activeProvider;
            }),
        [activeProvider]
    );

    return (
        <div ref={ref} className="relative mt-24">
            {/* Header */}
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
                    <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                    <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase terminal-text">
                        Multi-Cloud • 3 Regions • 15 Services
                    </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Infrastructure <span className="gradient-text">Map</span>
                </h3>
                <p className="text-white/30 text-xs max-w-md mx-auto">
                    Live topology visualization spanning AWS, Azure, and GCP. Toggle providers to filter the view.
                </p>
            </motion.div>

            {/* Provider toggle */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-2 mb-8"
            >
                {(["all", "aws", "azure", "gcp"] as Provider[]).map((p) => {
                    const colors = {
                        all: "#ffffff",
                        aws: "#FF9900",
                        azure: "#0078D4",
                        gcp: "#4285F4",
                    };
                    return (
                        <button
                            key={p}
                            onClick={() => setActiveProvider(p)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${activeProvider === p
                                ? "glass-strong text-white"
                                : "text-white/30 hover:text-white/60"
                                }`}
                            style={
                                activeProvider === p
                                    ? { boxShadow: `0 0 15px ${colors[p]}20` }
                                    : undefined
                            }
                        >
                            {p === "all" ? "All Providers" : p.toUpperCase()}
                        </button>
                    );
                })}
            </motion.div>

            {/* Map visualization */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="relative w-full aspect-[16/10] max-h-[520px] mb-8"
            >
                {/* SVG connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <filter id="infraGlow">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {filteredConnections.map((conn, i) => {
                        const from = infraNodes.find((n) => n.id === conn.from);
                        const to = infraNodes.find((n) => n.id === conn.to);
                        if (!from || !to) return null;

                        return (
                            <g key={i}>
                                <line
                                    x1={`${from.x}%`}
                                    y1={`${from.y}%`}
                                    x2={`${to.x}%`}
                                    y2={`${to.y}%`}
                                    stroke={conn.color}
                                    strokeWidth="1"
                                    strokeOpacity="0.1"
                                    strokeDasharray="3 3"
                                />
                                {conn.animated && (
                                    <DataPacket
                                        x1={from.x}
                                        y1={from.y}
                                        x2={to.x}
                                        y2={to.y}
                                        color={conn.color}
                                        delay={i * 0.4}
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Region boundaries */}
                {infraRegions.map((region) => (
                    <RegionBoundary
                        key={region.provider}
                        region={region}
                        isActive={activeProvider === "all" || activeProvider === region.provider}
                    />
                ))}

                {/* Service nodes */}
                {infraNodes.map((node) => (
                    <ServiceNode
                        key={node.id}
                        node={node}
                        isActive={hoveredNode === node.id || selectedNode === node.id}
                        isFiltered={
                            activeProvider !== "all" && node.provider !== activeProvider && node.id !== "cdn" && node.id !== "cicd"
                        }
                        onHover={setHoveredNode}
                        onClick={handleNodeClick}
                    />
                ))}

                {/* Detail panel */}
                {activeNodeData && (
                    <div className="absolute right-3 top-3 z-30 pointer-events-none">
                        <NodeDetailsPanel
                            visible={true}
                            title={activeNodeData.service}
                            subtitle={`${activeNodeData.provider.toUpperCase()} • ${activeNodeData.category}`}
                            details={[activeNodeData.description]}
                            configItems={activeNodeData.config}
                            statusColor={activeNodeData.color}
                        />
                    </div>
                )}
            </motion.div>

            {/* Provider stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
            >
                {(["aws", "azure", "gcp"] as const).map((p) => (
                    <ProviderStats
                        key={p}
                        provider={p}
                        active={activeProvider === "all" || activeProvider === p}
                    />
                ))}
            </motion.div>
        </div>
    );
}
