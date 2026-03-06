"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";

const taglines = [
    "Building scalable cloud infrastructure and resilient DevOps systems.",
    "Automating everything. Deploying everywhere. Monitoring always.",
    "From code commit to production — seamlessly.",
];

function TypingEffect() {
    const [currentLine, setCurrentLine] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const line = taglines[currentLine];
        let timeout: NodeJS.Timeout;

        if (!isDeleting && displayed.length < line.length) {
            timeout = setTimeout(() => setDisplayed(line.slice(0, displayed.length + 1)), 40);
        } else if (!isDeleting && displayed.length === line.length) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 20);
        } else {
            setIsDeleting(false);
            setCurrentLine((prev) => (prev + 1) % taglines.length);
        }
        return () => clearTimeout(timeout);
    }, [displayed, isDeleting, currentLine]);

    return (
        <span className="terminal-text text-neon-cyan">
            {displayed}
            <span className="inline-block w-2.5 h-5 ml-1 bg-neon-cyan animate-typing-cursor align-middle" />
        </span>
    );
}

function FloatingNodes() {
    const nodes = useMemo(
        () =>
            Array.from({ length: 20 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 2,
                duration: Math.random() * 4 + 4,
                delay: Math.random() * 3,
                opacity: Math.random() * 0.3 + 0.1,
            })),
        []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {nodes.map((node) => (
                <motion.div
                    key={node.id}
                    className="absolute rounded-full bg-neon-cyan"
                    style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        width: node.size,
                        height: node.size,
                        opacity: node.opacity,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        opacity: [node.opacity, node.opacity * 2, node.opacity],
                    }}
                    transition={{
                        duration: node.duration,
                        delay: node.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

function GridLines() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
            {/* Horizontal lines */}
            {Array.from({ length: 20 }, (_, i) => (
                <div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
                    style={{ top: `${(i + 1) * 5}%` }}
                />
            ))}
            {/* Vertical lines */}
            {Array.from({ length: 20 }, (_, i) => (
                <div
                    key={`v-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neon-cyan to-transparent"
                    style={{ left: `${(i + 1) * 5}%` }}
                />
            ))}
        </div>
    );
}

export default function HeroSection() {
    const layer1 = useParallax({ intensity: 0.5 });
    const layer2 = useParallax({ intensity: 1.0, invertX: true });
    const layer3 = useParallax({ intensity: 1.5 });

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background layers */}
            <div className="absolute inset-0 bg-dark-900" />

            {/* Parallax layer 1 — grid */}
            <div className="absolute inset-0" style={layer1.style}>
                <GridLines />
            </div>

            {/* Parallax layer 2 — glow orbs */}
            <div className="absolute inset-0" style={layer2.style}>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/8 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/3 rounded-full blur-[150px]" />
            </div>

            {/* Parallax layer 3 — floating nodes */}
            <div className="absolute inset-0" style={layer3.style}>
                <FloatingNodes />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Status badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-xs font-medium text-white/60 tracking-wider uppercase">
                        Available for opportunities
                    </span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6"
                >
                    <span className="text-white/60 text-lg sm:text-xl md:text-2xl block mb-2">Hi, I&apos;m</span>
                    <span className="gradient-text">Vansh</span>
                    <br />
                    <span className="text-white text-2xl sm:text-3xl md:text-4xl">DevOps Engineer &amp; Cloud Architect</span>
                </motion.h1>

                {/* Typing tagline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-base sm:text-lg md:text-xl mb-10 h-8 flex items-center justify-center"
                >
                    <span className="text-white/40 mr-2 terminal-text">$</span>
                    <TypingEffect />
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    <a
                        href="#projects"
                        className="group relative px-6 py-3 rounded-lg overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-80 group-hover:opacity-100 transition-opacity" />
                        <span className="relative text-sm font-semibold tracking-wider uppercase text-dark-900">
                            View Work
                        </span>
                    </a>
                    <a
                        href="#contact"
                        className="px-6 py-3 rounded-lg glass text-sm font-semibold tracking-wider uppercase text-white/70 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
                    >
                        Get In Touch
                    </a>
                </motion.div>

                {/* Terminal preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    className="mt-16 max-w-xl mx-auto"
                >
                    <div className="glass rounded-xl overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                            <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            <span className="ml-3 text-[10px] text-white/30 terminal-text">
                                ~/vansh@dev-vansh.in
                            </span>
                        </div>
                        <div className="p-4 terminal-text text-xs space-y-1.5">
                            <div className="text-white/40">
                                <span className="text-neon-green">❯</span> kubectl get nodes
                            </div>
                            <div className="text-white/25">
                                NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS&nbsp;&nbsp;&nbsp;ROLES&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AGE
                            </div>
                            <div className="text-white/30">
                                node-01&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;&nbsp;control&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;42d
                            </div>
                            <div className="text-white/30">
                                node-02&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;&nbsp;worker&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;42d
                            </div>
                            <div className="text-white/30">
                                node-03&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;&nbsp;worker&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;42d
                            </div>
                            <div className="text-white/40 mt-2">
                                <span className="text-neon-green">❯</span>{" "}
                                <span className="animate-typing-cursor border-r-2 border-neon-cyan pr-1">
                                    terraform plan
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
                >
                    <div className="w-1 h-1.5 rounded-full bg-neon-cyan" />
                </motion.div>
            </motion.div>
        </section>
    );
}
