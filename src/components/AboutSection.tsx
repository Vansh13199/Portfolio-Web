"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, slideInLeft, slideInRight } from "@/animations/scrollAnimations";

const codeSnippet = `# Infrastructure as Code
resource "aws_eks_cluster" "main" {
  name     = "production-cluster"
  role_arn = aws_iam_role.eks.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = var.subnet_ids
    security_group_ids = [
      aws_security_group.eks.id
    ]
  }

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}`;

const highlights = [
    {
        icon: "🏗️",
        title: "Infrastructure First",
        description:
            "Every system I build starts with a solid, reproducible infrastructure foundation using IaC principles.",
    },
    {
        icon: "🔄",
        title: "Automate Everything",
        description:
            "From CI/CD pipelines to monitoring alerts — if it can be automated, it should be automated.",
    },
    {
        icon: "📐",
        title: "Scalable by Design",
        description:
            "Architecting for scale from day one. Microservices, container orchestration, and distributed systems.",
    },
    {
        icon: "🛡️",
        title: "Resilient Systems",
        description:
            "Building fault-tolerant systems with redundancy, health checks, and graceful degradation strategies.",
    },
];

export default function AboutSection() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <section id="about" className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-dark-800 bg-grid" />

            <div ref={ref} className="relative max-w-7xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="text-center mb-20"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neon-purple/60 mb-3 block">
                        About Me
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Engineering <span className="gradient-text">Mindset</span>
                    </h2>
                </motion.div>

                {/* Split layout */}
                <div className="grid md:grid-cols-2 gap-16 items-start">
                    {/* Left — Text */}
                    <motion.div
                        variants={slideInLeft}
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        className="space-y-6"
                    >
                        <p className="text-white/60 leading-relaxed">
                            I&apos;m Vansh — a DevOps Engineer and Cloud Architect with a passion for building
                            scalable, resilient infrastructure. Currently a 2nd-year BE student with
                            hands-on experience across AWS, Azure, and GCP.
                        </p>
                        <p className="text-white/50 leading-relaxed text-sm">
                            My approach combines deep technical knowledge with a systems-thinking
                            philosophy. I believe in infrastructure as code, continuous delivery, and
                            the power of automation to transform how teams ship software.
                        </p>
                        <p className="text-white/50 leading-relaxed text-sm">
                            Every pipeline I design, every cluster I configure, and every architecture
                            I draft is guided by one principle:{" "}
                            <span className="text-neon-cyan font-medium">
                                build it right, build it to last.
                            </span>
                        </p>

                        {/* Highlights grid */}
                        <div className="grid grid-cols-2 gap-4 pt-6">
                            {highlights.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                    className="glass rounded-xl p-4 group hover:box-glow-cyan transition-all duration-300"
                                >
                                    <span className="text-xl mb-2 block">{item.icon}</span>
                                    <h4 className="text-xs font-semibold text-white/80 mb-1">
                                        {item.title}
                                    </h4>
                                    <p className="text-[10px] text-white/40 leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Code block */}
                    <motion.div
                        variants={slideInRight}
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                    >
                        <div className="glass rounded-xl overflow-hidden sticky top-24">
                            {/* Terminal header */}
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
                                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                <span className="ml-3 text-[10px] text-white/30 terminal-text">
                                    main.tf
                                </span>
                            </div>

                            {/* Code content */}
                            <div className="p-5 overflow-x-auto">
                                <pre className="terminal-text text-xs leading-relaxed">
                                    {codeSnippet.split("\n").map((line, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={isVisible ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: 0.5 + i * 0.04, duration: 0.3 }}
                                            className="flex"
                                        >
                                            <span className="w-8 text-right mr-4 text-white/15 select-none">
                                                {i + 1}
                                            </span>
                                            <span
                                                className={
                                                    line.startsWith("#")
                                                        ? "text-white/30 italic"
                                                        : line.includes("=")
                                                            ? "text-neon-cyan/70"
                                                            : line.includes('"')
                                                                ? "text-neon-green/60"
                                                                : "text-white/50"
                                                }
                                            >
                                                {line || "\u00A0"}
                                            </span>
                                        </motion.div>
                                    ))}
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
