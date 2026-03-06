"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cloudNodes, cloudConnections, CloudNode } from "@/lib/cloudData";
import { staggerContainer, staggerItem, fadeInUp } from "@/animations/scrollAnimations";

function ConnectionLine({
    x1, y1, x2, y2, delay,
}: {
    x1: number; y1: number; x2: number; y2: number; delay: number;
}) {
    return (
        <g>
            <line
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="rgba(0, 240, 255, 0.08)"
                strokeWidth="1"
            />
            <motion.circle
                r="2"
                fill="#00f0ff"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.8, 0],
                    cx: [`${x1}%`, `${x2}%`],
                    cy: [`${y1}%`, `${y2}%`],
                }}
                transition={{
                    duration: 3,
                    delay,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </g>
    );
}

function CloudNodeCard({
    node,
    onHover,
    isActive,
}: {
    node: CloudNode;
    onHover: (id: string | null) => void;
    isActive: boolean;
}) {
    return (
        <motion.div
            className="absolute cursor-pointer group"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
            variants={staggerItem}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            whileHover={{ scale: 1.15, zIndex: 10 }}
        >
            {/* Glow ring */}
            <div
                className={`absolute inset-0 rounded-xl blur-xl transition-opacity duration-300 ${isActive ? "opacity-60" : "opacity-0"
                    }`}
                style={{ backgroundColor: node.color }}
            />

            {/* Card */}
            <div
                className={`relative glass rounded-xl px-3 py-2 flex items-center gap-2 transition-all duration-300 ${isActive ? "border-opacity-40" : ""
                    }`}
                style={{
                    borderColor: isActive ? node.color : undefined,
                    boxShadow: isActive ? `0 0 20px ${node.color}30` : undefined,
                }}
            >
                <span className="text-lg">{node.icon}</span>
                <div>
                    <div className="text-xs font-semibold text-white/90">{node.name}</div>
                    <div className="text-[9px] uppercase tracking-wider" style={{ color: node.color }}>
                        {node.provider}
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 glass-strong rounded-lg px-3 py-2 min-w-[180px] z-20"
                >
                    <p className="text-[10px] text-white/60 leading-relaxed">{node.description}</p>
                </motion.div>
            )}
        </motion.div>
    );
}

export default function CloudVisualization() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleHover = useCallback((id: string | null) => setActiveNode(id), []);

    return (
        <section id="cloud" className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-dark-900 bg-dots" />

            <div ref={ref} className="relative max-w-7xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neon-cyan/60 mb-3 block">
                        Infrastructure
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Cloud <span className="gradient-text">Architecture</span>
                    </h2>
                    <p className="text-white/40 max-w-lg mx-auto text-sm">
                        Multi-cloud expertise spanning AWS, Azure, and GCP with container orchestration
                        and infrastructure-as-code at the core.
                    </p>
                </motion.div>

                {/* Cloud map */}
                <motion.div
                    ref={containerRef}
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="relative w-full aspect-[16/9] max-h-[500px]"
                >
                    {/* SVG connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {cloudConnections.map((conn, i) => {
                            const fromNode = cloudNodes.find((n) => n.id === conn.from);
                            const toNode = cloudNodes.find((n) => n.id === conn.to);
                            if (!fromNode || !toNode) return null;
                            return (
                                <ConnectionLine
                                    key={`${conn.from}-${conn.to}`}
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    delay={i * 0.5}
                                />
                            );
                        })}
                    </svg>

                    {/* Nodes */}
                    {cloudNodes.map((node) => (
                        <CloudNodeCard
                            key={node.id}
                            node={node}
                            onHover={handleHover}
                            isActive={activeNode === node.id}
                        />
                    ))}
                </motion.div>

                {/* Provider legend */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="flex flex-wrap items-center justify-center gap-6 mt-12"
                >
                    {[
                        { label: "AWS", color: "#FF9900" },
                        { label: "Azure", color: "#0078D4" },
                        { label: "GCP", color: "#4285F4" },
                        { label: "Kubernetes", color: "#326CE5" },
                        { label: "CI/CD", color: "#39ff14" },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-white/40 font-medium">{item.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
