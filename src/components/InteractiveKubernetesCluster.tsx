"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp } from "@/animations/scrollAnimations";
import NodeDetailsPanel from "./NodeDetailsPanel";
import MetricsOverlay from "./MetricsOverlay";
import {
    controlPlane,
    workerNodes,
    pods,
    services,
    ingressNode,
    connections,
    scalingEvents,
    K8sNode,
} from "@/lib/kubernetesTopology";

/* ── Traffic particle ─────────────────────────────────── */
function TrafficParticle({
    x1, y1, x2, y2, color, delay, duration,
}: {
    x1: number; y1: number; x2: number; y2: number;
    color: string; delay: number; duration: number;
}) {
    return (
        <motion.circle
            r="2.5"
            fill={color}
            filter="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{
                cx: [`${x1}%`, `${x2}%`],
                cy: [`${y1}%`, `${y2}%`],
                opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
        />
    );
}

/* ── Connection line ──────────────────────────────────── */
function ConnectionSVG({
    x1, y1, x2, y2, color, animated,
}: {
    x1: number; y1: number; x2: number; y2: number;
    color: string; animated: boolean;
}) {
    return (
        <g>
            <line
                x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.12"
                strokeDasharray={animated ? "4 4" : undefined}
            />
            {animated && (
                <TrafficParticle
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    color={color}
                    delay={Math.random() * 3}
                    duration={2.5 + Math.random() * 1.5}
                />
            )}
        </g>
    );
}

/* ── K8s Node card ────────────────────────────────────── */
function K8sNodeCard({
    node,
    isActive,
    isExpanded,
    onHover,
    onClick,
    podCount,
}: {
    node: K8sNode;
    isActive: boolean;
    isExpanded: boolean;
    onHover: (id: string | null) => void;
    onClick: (id: string) => void;
    podCount: number;
}) {
    const isControlPlane = node.type === "control-plane";
    const isIngress = node.type === "ingress";

    return (
        <motion.div
            className="absolute cursor-pointer group"
            style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isActive || isExpanded ? 20 : 5,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: isControlPlane ? 0 : isIngress ? 0.8 : 0.3 }}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(node.id)}
            whileHover={{ scale: 1.08 }}
        >
            {/* Outer glow ring */}
            <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                    background: `radial-gradient(circle, ${node.glowColor}, transparent 70%)`,
                    transform: "scale(2.5)",
                }}
                animate={{
                    opacity: isActive ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Card body */}
            <div
                className={`relative glass-strong rounded-xl transition-all duration-300 ${isControlPlane ? "px-5 py-3" : "px-4 py-2.5"
                    }`}
                style={{
                    borderColor: isActive ? node.color : undefined,
                    boxShadow: isActive ? `0 0 25px ${node.color}30` : undefined,
                }}
            >
                {/* Icon row */}
                <div className="flex items-center gap-2 mb-1">
                    <span className={`${isControlPlane ? "text-base" : "text-sm"}`}>
                        {isControlPlane ? "🎛️" : isIngress ? "🌐" : "🖥️"}
                    </span>
                    <span
                        className={`font-bold tracking-wide ${isControlPlane ? "text-xs" : "text-[10px]"
                            }`}
                        style={{ color: node.color }}
                    >
                        {node.label}
                    </span>
                </div>

                {/* Pod count badge */}
                {!isIngress && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[8px] text-white/30">pods:</span>
                        <span className="text-[9px] font-bold terminal-text" style={{ color: node.color }}>
                            {podCount}
                        </span>
                        <div className="flex gap-0.5 ml-1">
                            {Array.from({ length: Math.min(podCount, 6) }, (_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-sm"
                                    style={{ backgroundColor: node.color }}
                                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                                    transition={{
                                        duration: 1.5,
                                        delay: i * 0.2,
                                        repeat: Infinity,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/* ── Pod list (expanded view) ─────────────────────────── */
function PodList({
    nodeId,
    visible,
}: {
    nodeId: string;
    visible: boolean;
}) {
    const nodePods = pods.filter((p) => p.nodeId === nodeId);
    if (nodePods.length === 0) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass rounded-lg p-2 space-y-1 mt-1 overflow-hidden"
                >
                    {nodePods.map((pod, i) => (
                        <motion.div
                            key={pod.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/[0.03] transition-colors"
                        >
                            <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                    backgroundColor:
                                        pod.status === "Running"
                                            ? "#39ff14"
                                            : pod.status === "Pending"
                                                ? "#FF9900"
                                                : "#ff6b6b",
                                }}
                            />
                            <span className="text-[9px] terminal-text text-white/50 flex-1 truncate">
                                {pod.name}
                            </span>
                            <span className="text-[8px] text-white/25">{pod.cpu}m</span>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ── Main component ───────────────────────────────────── */
export default function InteractiveKubernetesCluster() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [expandedNode, setExpandedNode] = useState<string | null>(null);
    const [showMetrics, setShowMetrics] = useState(true);

    const allNodes = useMemo(
        () => [controlPlane, ...workerNodes, ingressNode],
        []
    );

    const getNodePos = useCallback(
        (id: string) => {
            const n = allNodes.find((n) => n.id === id);
            return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
        },
        [allNodes]
    );

    const activeNode = useMemo(
        () => allNodes.find((n) => n.id === hoveredNode),
        [allNodes, hoveredNode]
    );

    const handleClick = useCallback(
        (id: string) => setExpandedNode((prev) => (prev === id ? null : id)),
        []
    );

    return (
        <div ref={ref} className="relative">
            {/* Header */}
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase terminal-text">
                        Cluster Status: Healthy
                    </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Kubernetes <span className="text-neon-cyan">Cluster</span>
                </h3>
                <p className="text-white/30 text-xs max-w-md mx-auto">
                    Interactive simulation of a production K8s cluster. Hover nodes for details, click to expand pods.
                </p>
            </motion.div>

            {/* Cluster visualization */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative w-full aspect-[16/10] max-h-[520px] mb-8"
            >
                {/* SVG layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Connections */}
                    {connections.map((conn, i) => {
                        const from = getNodePos(conn.from);
                        const to = getNodePos(conn.to);
                        const color =
                            conn.type === "control"
                                ? "#a855f7"
                                : conn.type === "ingress"
                                    ? "#39ff14"
                                    : "#00f0ff";
                        return (
                            <ConnectionSVG
                                key={i}
                                x1={from.x}
                                y1={from.y}
                                x2={to.x}
                                y2={to.y}
                                color={color}
                                animated={conn.animated}
                            />
                        );
                    })}

                    {/* External traffic arrows into ingress */}
                    {[30, 50, 70].map((x, i) => (
                        <TrafficParticle
                            key={`ext-${i}`}
                            x1={x}
                            y1={100}
                            x2={ingressNode.x}
                            y2={ingressNode.y}
                            color="#39ff14"
                            delay={i * 1.2}
                            duration={2}
                        />
                    ))}
                </svg>

                {/* Layer labels */}
                <div className="absolute left-1 top-[5%] text-[8px] text-white/15 uppercase tracking-widest font-bold"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    Control Plane
                </div>
                <div className="absolute left-1 top-[35%] text-[8px] text-white/15 uppercase tracking-widest font-bold"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    Worker Nodes
                </div>
                <div className="absolute left-1 top-[70%] text-[8px] text-white/15 uppercase tracking-widest font-bold"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    Ingress Layer
                </div>

                {/* Horizontal separators */}
                <div className="absolute left-8 right-2 top-[28%] h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="absolute left-8 right-2 top-[65%] h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                {/* Nodes */}
                {allNodes.map((node) => {
                    const nodePodCount = pods.filter((p) => p.nodeId === node.id).length;
                    return (
                        <K8sNodeCard
                            key={node.id}
                            node={node}
                            isActive={hoveredNode === node.id}
                            isExpanded={expandedNode === node.id}
                            onHover={setHoveredNode}
                            onClick={handleClick}
                            podCount={nodePodCount}
                        />
                    );
                })}

                {/* Expanded pod list panel */}
                {expandedNode && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-4 top-4 z-30 w-56"
                    >
                        <div className="glass-strong rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-white/70">
                                    Running Pods — {allNodes.find((n) => n.id === expandedNode)?.label}
                                </span>
                                <button
                                    onClick={() => setExpandedNode(null)}
                                    className="text-white/30 hover:text-white/60 text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                            <PodList nodeId={expandedNode} visible={true} />
                        </div>
                    </motion.div>
                )}

                {/* Detail panel on hover */}
                {activeNode && !expandedNode && (
                    <div className="absolute left-4 top-4 z-20 pointer-events-none">
                        <NodeDetailsPanel
                            visible={true}
                            title={activeNode.label}
                            subtitle={activeNode.type === "control-plane" ? "K8s Master" : activeNode.type}
                            details={activeNode.details}
                            metrics={[
                                { label: "CPU", value: activeNode.metrics.cpu, max: 100, color: activeNode.color },
                                { label: "Memory", value: activeNode.metrics.memory, max: 100, color: activeNode.color },
                            ]}
                            statusColor={activeNode.color}
                        />
                    </div>
                )}
            </motion.div>

            {/* Metrics toggle + Overlay */}
            <div className="mb-6 text-center">
                <button
                    onClick={() => setShowMetrics((v) => !v)}
                    className="text-[9px] text-white/30 hover:text-white/50 tracking-wider uppercase terminal-text transition-colors"
                >
                    {showMetrics ? "▼ Hide Metrics" : "▶ Show Metrics"}
                </button>
            </div>
            <AnimatePresence>
                {showMetrics && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <MetricsOverlay />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scaling events log */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="mt-8 max-w-md mx-auto"
            >
                <div className="glass rounded-xl overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                        <span className="ml-2 text-[9px] text-white/25 terminal-text">
                            cluster-events.log
                        </span>
                    </div>
                    <div className="p-3 terminal-text text-[10px] space-y-1.5 max-h-32 overflow-y-auto">
                        {scalingEvents.map((ev, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 1.0 + i * 0.15 }}
                                className="flex items-start gap-2"
                            >
                                <span className="text-white/20 shrink-0 w-12">{ev.time}</span>
                                <span
                                    className={
                                        ev.type === "scale-up"
                                            ? "text-neon-green/70"
                                            : ev.type === "scale-down"
                                                ? "text-neon-cyan/60"
                                                : ev.type === "restart"
                                                    ? "text-yellow-400/60"
                                                    : "text-neon-purple/60"
                                    }
                                >
                                    {ev.event}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
