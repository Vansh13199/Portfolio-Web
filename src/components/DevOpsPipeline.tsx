"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp } from "@/animations/scrollAnimations";

const stages = [
    {
        id: "code",
        label: "Code",
        icon: "💻",
        color: "#a855f7",
        description: "Write clean, tested code with version control",
    },
    {
        id: "build",
        label: "Build",
        icon: "🔨",
        color: "#4361ee",
        description: "Containerize with Docker, compile artifacts",
    },
    {
        id: "test",
        label: "Test",
        icon: "🧪",
        color: "#00f0ff",
        description: "Automated unit, integration, and E2E testing",
    },
    {
        id: "deploy",
        label: "Deploy",
        icon: "🚀",
        color: "#39ff14",
        description: "Zero-downtime deployments to Kubernetes",
    },
    {
        id: "monitor",
        label: "Monitor",
        icon: "📊",
        color: "#FF9900",
        description: "Observability with metrics, logs, and traces",
    },
];

function DataPacket({ delay, color }: { delay: number; color: string }) {
    return (
        <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }}
            initial={{ left: "-2%", opacity: 0 }}
            animate={{ left: "102%", opacity: [0, 1, 1, 1, 0] }}
            transition={{
                duration: 4,
                delay,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
}

export default function DevOpsPipeline() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <section id="pipeline" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-dark-800 bg-grid" />

            <div ref={ref} className="relative max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="text-center mb-20"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neon-green/60 mb-3 block">
                        Workflow
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        DevOps <span className="gradient-text">Pipeline</span>
                    </h2>
                    <p className="text-white/40 max-w-lg mx-auto text-sm">
                        Automated, reliable, and lightning-fast — from code commit to production.
                    </p>
                </motion.div>

                {/* Pipeline */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 z-[1]">
                        <motion.div
                            className="h-full bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green"
                            initial={{ width: 0 }}
                            // Delay the line animation until the 5 cards finish their staggered entrance
                            // Card delay = 0.3 + (i * 0.15) -> max delay is 0.3 + (4 * 0.15) = 0.9s
                            // Wait for 0.9s + 0.4s (duration) = 1.3s before drawing line
                            animate={isVisible ? { width: "100%" } : {}}
                            transition={{ duration: 1.5, delay: 1.4, ease: "easeInOut" }}
                        />
                        {/* Flowing data packets (delay accounting for card load + line draw) */}
                        {isVisible && (
                            <>
                                <DataPacket delay={1.4} color="#00f0ff" />
                                <DataPacket delay={2.7} color="#a855f7" />
                                <DataPacket delay={4.0} color="#39ff14" />
                            </>
                        )}
                    </div>

                    {/* Stages - using relative z-10 block so they sit functionally above line */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative z-10">
                        {stages.map((stage, i) => (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
                                // Sequential stagger matching the requirement
                                transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                                className="relative group"
                            >
                                <div className="glass bg-dark-900/90 rounded-xl p-5 text-center hover:box-glow-cyan transition-all duration-300 relative z-20">
                                    {/* Stage number */}
                                    <div
                                        className="absolute -top-3 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                                        style={{
                                            backgroundColor: stage.color,
                                            color: "#0a0a0f",
                                            boxShadow: `0 0 12px ${stage.color}50`,
                                        }}
                                    >
                                        {i + 1}
                                    </div>

                                    {/* Icon */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: i * 0.3,
                                            repeat: Infinity,
                                        }}
                                        className="text-3xl mb-3"
                                    >
                                        {stage.icon}
                                    </motion.div>

                                    {/* Label */}
                                    <h3
                                        className="text-sm font-bold mb-2"
                                        style={{ color: stage.color }}
                                    >
                                        {stage.label}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[10px] text-white/40 leading-relaxed">
                                        {stage.description}
                                    </p>

                                    {/* Pulse indicator */}
                                    <motion.div
                                        className="mt-3 mx-auto w-2 h-2 rounded-full"
                                        style={{ backgroundColor: stage.color }}
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: i * 0.3,
                                            repeat: Infinity,
                                        }}
                                    />
                                </div>

                                {/* Arrow (mobile) */}
                                {i < stages.length - 1 && (
                                    <div className="md:hidden flex justify-center py-2">
                                        <motion.div
                                            animate={{ y: [0, 4, 0] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="text-white/20 text-lg"
                                        >
                                            ↓
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
