"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp } from "@/animations/scrollAnimations";

// No dummy projects — this section renders an elegant empty state
export default function Projects() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <section id="projects" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-dark-900 bg-dots" />

            <div ref={ref} className="relative max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neon-cyan/60 mb-3 block">
                        Portfolio
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                </motion.div>

                {/* Empty state */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-md mx-auto"
                >
                    <div className="glass rounded-2xl p-10 text-center relative overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-cyan/5 rounded-full blur-[80px]" />

                        <div className="relative">
                            {/* Icon */}
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="text-5xl mb-6"
                            >
                                🚀
                            </motion.div>

                            <h3 className="text-lg font-semibold text-white/80 mb-3">
                                Projects Launching Soon
                            </h3>
                            <p className="text-sm text-white/40 leading-relaxed mb-6">
                                Exciting cloud-native and DevOps projects are in development.
                                This section will showcase real, production-grade work.
                            </p>

                            {/* Terminal hint */}
                            <div className="glass rounded-lg p-3 terminal-text text-xs text-left">
                                <div className="text-white/30">
                                    <span className="text-neon-green">❯</span> git log --oneline -3
                                </div>
                                <div className="text-white/20 mt-1">a1b2c3d feat: setup project scaffolding</div>
                                <div className="text-white/20">e4f5g6h feat: configure CI/CD pipeline</div>
                                <div className="text-white/20">i7j8k9l feat: add monitoring stack</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
