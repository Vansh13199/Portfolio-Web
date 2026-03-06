"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileBlocker() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <AnimatePresence>
            {isMobile && (
                <motion.div
                    key="mobile-blocker"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{ background: "#0a0a0f" }}
                >
                    {/* Animated background grid */}
                    <div className="absolute inset-0 bg-grid opacity-30" />

                    {/* Floating particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full"
                            style={{
                                backgroundColor:
                                    i % 3 === 0
                                        ? "#00f0ff"
                                        : i % 3 === 1
                                            ? "#a855f7"
                                            : "#39ff14",
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0, 0.8, 0],
                                scale: [0, 1.5, 0],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                delay: Math.random() * 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Main popup card */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                            delay: 0.2,
                        }}
                        className="relative mx-6 max-w-sm w-full"
                    >
                        {/* Glow effect behind card */}
                        <div
                            className="absolute -inset-1 rounded-2xl opacity-50 blur-xl"
                            style={{
                                background:
                                    "linear-gradient(135deg, #00f0ff30, #a855f730, #ff00ff30)",
                            }}
                        />

                        {/* Card */}
                        <div className="relative glass-strong rounded-2xl p-8 text-center overflow-hidden">
                            {/* Scan line effect */}
                            <motion.div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        "linear-gradient(transparent 50%, rgba(0, 240, 255, 0.03) 50%)",
                                    backgroundSize: "100% 4px",
                                }}
                                animate={{ y: [0, 4, 0] }}
                                transition={{
                                    duration: 0.3,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />

                            {/* Monitor icon */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="mb-6"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-dark-900/80 border border-white/10">
                                    <svg
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="url(#icon-gradient)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <defs>
                                            <linearGradient
                                                id="icon-gradient"
                                                x1="0%"
                                                y1="0%"
                                                x2="100%"
                                                y2="100%"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#00f0ff"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#a855f7"
                                                />
                                            </linearGradient>
                                        </defs>
                                        <rect
                                            x="2"
                                            y="3"
                                            width="20"
                                            height="14"
                                            rx="2"
                                        />
                                        <line
                                            x1="8"
                                            y1="21"
                                            x2="16"
                                            y2="21"
                                        />
                                        <line
                                            x1="12"
                                            y1="17"
                                            x2="12"
                                            y2="21"
                                        />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Error badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-5"
                                style={{
                                    background: "rgba(255, 60, 60, 0.1)",
                                    border: "1px solid rgba(255, 60, 60, 0.2)",
                                    color: "#ff6b6b",
                                }}
                            >
                                <motion.span
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                    }}
                                    className="w-1.5 h-1.5 rounded-full bg-red-500"
                                />
                                Desktop Only
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl font-bold text-white mb-3"
                            >
                                Open on{" "}
                                <span className="gradient-text">Desktop</span>
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-white/40 text-sm leading-relaxed mb-6"
                            >
                                This portfolio features interactive 3D
                                visualizations, animations, and experiences
                                designed for desktop browsers.
                            </motion.p>

                            {/* Terminal-style suggestion */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="terminal-text text-[10px] text-left rounded-lg p-3 mb-2"
                                style={{
                                    background: "rgba(0, 0, 0, 0.4)",
                                    border: "1px solid rgba(255, 255, 255, 0.05)",
                                }}
                            >
                                <span className="text-neon-green/60">
                                    ${" "}
                                </span>
                                <span className="text-white/50">
                                    recommended_resolution
                                </span>
                                <br />
                                <span className="text-neon-cyan/70">
                                    → 1280×720 or higher
                                </span>
                            </motion.div>

                            {/* Pulsing border bottom */}
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-[2px]"
                                style={{
                                    background:
                                        "linear-gradient(90deg, transparent, #00f0ff, #a855f7, transparent)",
                                }}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
