"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp } from "@/animations/scrollAnimations";

interface TimelineItem {
    year: string;
    title: string;
    description: string;
    type: "education" | "achievement" | "certification" | "milestone";
    icon: string;
}

const timelineData: TimelineItem[] = [
    {
        year: "2024",
        title: "Started B.E. in Computer Science",
        description:
            "Embarked on a formal CS journey while already building cloud-native systems. Deep dive into algorithms, data structures, and system design.",
        type: "education",
        icon: "🎓",
    },
    {
        year: "2024",
        title: "Multi-Cloud Architecture",
        description:
            "Gained hands-on experience across AWS, Azure, and GCP. Designed and deployed production-grade infrastructure spanning all three major providers.",
        type: "milestone",
        icon: "☁️",
    },
    {
        year: "2024",
        title: "Kubernetes & Container Orchestration",
        description:
            "Mastered container orchestration with Kubernetes, deploying multi-node clusters with auto-scaling, service mesh, and comprehensive monitoring.",
        type: "achievement",
        icon: "☸",
    },
    {
        year: "2025",
        title: "Infrastructure as Code Mastery",
        description:
            "Built complex, multi-environment infrastructure using Terraform, with state management, modules, and CI/CD integration for automated provisioning.",
        type: "achievement",
        icon: "🏗️",
    },
    {
        year: "2025",
        title: "DevOps Pipeline Engineering",
        description:
            "Designed end-to-end CI/CD pipelines with automated testing, security scanning, and zero-downtime deployments across microservice architectures.",
        type: "milestone",
        icon: "🔄",
    },
    {
        year: "2025",
        title: "Distributed Systems Design",
        description:
            "Engineering high-availability distributed systems with fault tolerance, eventual consistency, and horizontal scaling patterns.",
        type: "milestone",
        icon: "🌐",
    },
];

const typeColors: Record<string, string> = {
    education: "#a855f7",
    achievement: "#00f0ff",
    certification: "#39ff14",
    milestone: "#FF9900",
};

export default function Timeline() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });

    return (
        <section id="experience" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-dark-800 bg-grid" />

            <div ref={ref} className="relative max-w-4xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="text-center mb-20"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neon-purple/60 mb-3 block">
                        Journey
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Experience <span className="gradient-text">Timeline</span>
                    </h2>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Center line */}
                    <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px">
                        <motion.div
                            className="w-full bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-cyan/0"
                            initial={{ height: 0 }}
                            animate={isVisible ? { height: "100%" } : {}}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Items */}
                    {timelineData.map((item, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                                className={`relative flex items-start mb-12 ${isLeft
                                        ? "md:flex-row flex-row"
                                        : "md:flex-row-reverse flex-row"
                                    }`}
                            >
                                {/* Node dot */}
                                <div
                                    className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-10 mt-5"
                                    style={{
                                        backgroundColor: typeColors[item.type],
                                        boxShadow: `0 0 12px ${typeColors[item.type]}60`,
                                    }}
                                />

                                {/* Card */}
                                <div
                                    className={`ml-14 md:ml-0 md:w-[calc(50%-30px)] ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"
                                        }`}
                                >
                                    <div className="glass rounded-xl p-5 hover:box-glow-cyan transition-all duration-300 group">
                                        <div
                                            className={`flex items-center gap-2 mb-2 ${isLeft ? "md:justify-end" : ""
                                                }`}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span
                                                className="text-[10px] font-bold tracking-wider uppercase"
                                                style={{ color: typeColors[item.type] }}
                                            >
                                                {item.type}
                                            </span>
                                        </div>
                                        <div
                                            className={`text-xs text-white/30 mb-1 terminal-text ${isLeft ? "md:text-right" : ""
                                                }`}
                                        >
                                            {item.year}
                                        </div>
                                        <h3 className="text-sm font-semibold text-white/90 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-white/40 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
