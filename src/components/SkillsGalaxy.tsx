"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp } from "@/animations/scrollAnimations";

interface Skill {
    name: string;
    category: string;
    color: string;
}

const skills: Skill[] = [
    // Cloud
    { name: "AWS", category: "cloud", color: "#FF9900" },
    { name: "Azure", category: "cloud", color: "#0078D4" },
    { name: "GCP", category: "cloud", color: "#4285F4" },
    // DevOps
    { name: "Docker", category: "devops", color: "#2496ED" },
    { name: "Kubernetes", category: "devops", color: "#326CE5" },
    { name: "Terraform", category: "devops", color: "#7B42BC" },
    { name: "CI/CD", category: "devops", color: "#39ff14" },
    { name: "Linux", category: "devops", color: "#FCC624" },
    { name: "Networking", category: "devops", color: "#00f0ff" },
    // Programming
    { name: "C++", category: "programming", color: "#00599C" },
    { name: "JavaScript", category: "programming", color: "#F7DF1E" },
    { name: "Python", category: "programming", color: "#3776AB" },
    { name: "TypeScript", category: "programming", color: "#3178C6" },
    // Infrastructure
    { name: "Microservices", category: "infrastructure", color: "#a855f7" },
    { name: "Scalability", category: "infrastructure", color: "#ff6b6b" },
    { name: "Distributed Sys", category: "infrastructure", color: "#ff00ff" },
];

const categories = [
    { key: "all", label: "All", color: "#ffffff" },
    { key: "cloud", label: "Cloud", color: "#FF9900" },
    { key: "devops", label: "DevOps", color: "#39ff14" },
    { key: "programming", label: "Languages", color: "#3178C6" },
    { key: "infrastructure", label: "Infra", color: "#a855f7" },
];

interface OrbitNode {
    skill: Skill;
    angle: number;
    radius: number;
    speed: number;
    size: number;
}

export default function SkillsGalaxy() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const [activeCategory, setActiveCategory] = useState("all");
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const nodesRef = useRef<OrbitNode[]>([]);
    const rectRef = useRef({ width: 0, height: 0 }); // Store canvas dimensions for hover
    const timeRef = useRef<number>(0); // Store elapsed animation time for hover calculation
    const mouseRef = useRef({ x: 0, y: 0 });

    // Initialize orbit nodes (radii are now relative percentages 0..1)
    useEffect(() => {
        const nodes: OrbitNode[] = skills.map((skill, i) => {
            const ringIndex = Math.floor(i / 4);
            const numInRing = Math.min(4, skills.length - ringIndex * 4);
            // Radii range proportionally based on 4 rings (approx 0.3 to 0.9 of max radius)
            const relativeRadius = 0.3 + (ringIndex * 0.2);
            // Nodes in the same ring MUST share the exact same speed so they maintain their distance
            // Alternate spin directions per ring for visual motion
            const direction = ringIndex % 2 === 0 ? 1 : -1;
            const ringSpeed = (0.0003 + ringIndex * 0.00015) * direction;

            return {
                skill,
                angle: (i * (Math.PI * 2)) / numInRing + ringIndex * 0.5,
                radius: relativeRadius, // store relative value, scale dynamically later
                speed: ringSpeed,
                size: 24, // uniform size prevents clipping/overlap that random sizes might cause
            };
        });
        nodesRef.current = nodes;
    }, []);

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
            ctx.clearRect(0, 0, width, height);
            const cx = width / 2;
            const cy = height / 2;

            // Layout fix: Calculate scale/radius relative to container dimensions
            const maxRadius = Math.min(width, height) / 2;
            // Leave margin for node size so it doesn't clip
            const availableRadius = maxRadius - 30;

            // Draw orbit rings
            const rings = [0.3, 0.5, 0.7, 0.9];
            rings.forEach((relativeR) => {
                ctx.beginPath();
                ctx.arc(cx, cy, relativeR * availableRadius, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Draw center
            const centerSize = availableRadius * 0.15;
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerSize);
            gradient.addColorStop(0, "rgba(0, 240, 255, 0.3)");
            gradient.addColorStop(1, "rgba(0, 240, 255, 0)");
            ctx.beginPath();
            ctx.arc(cx, cy, centerSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.font = `bold ${Math.max(10, centerSize * 0.4)}px var(--font-jetbrains), monospace`;
            ctx.fillStyle = "rgba(0, 240, 255, 0.8)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("SKILLS", cx, cy);

            // Draw nodes
            nodesRef.current.forEach((node) => {
                const isFiltered =
                    activeCategory !== "all" && node.skill.category !== activeCategory;
                const isHovered = hoveredSkill === node.skill.name;

                node.angle += node.speed * (isHovered ? 0.1 : 1);
                const currentAngle = node.angle + time * node.speed;
                const r = node.radius * availableRadius;

                const x = cx + Math.cos(currentAngle) * r;
                const y = cy + Math.sin(currentAngle) * r;

                const alpha = isFiltered ? 0.1 : isHovered ? 1 : 0.7;
                const nodeSize = node.size * (availableRadius / 250) * (isHovered ? 1.3 : 1);

                // Connection line to center
                if (!isFiltered) {
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(x, y);
                    ctx.strokeStyle = `${node.skill.color}08`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                // Glow
                if (isHovered) {
                    const glow = ctx.createRadialGradient(x, y, 0, x, y, nodeSize * 2);
                    glow.addColorStop(0, `${node.skill.color}40`);
                    glow.addColorStop(1, `${node.skill.color}00`);
                    ctx.beginPath();
                    ctx.arc(x, y, nodeSize * 2, 0, Math.PI * 2);
                    ctx.fillStyle = glow;
                    ctx.fill();
                }

                // Node circle
                ctx.beginPath();
                ctx.arc(x, y, nodeSize / 2, 0, Math.PI * 2);
                ctx.fillStyle = isFiltered
                    ? "rgba(255,255,255,0.02)"
                    : `${node.skill.color}${Math.round(alpha * 40)
                        .toString(16)
                        .padStart(2, "0")}`;
                ctx.fill();
                ctx.strokeStyle = isFiltered
                    ? "rgba(255,255,255,0.05)"
                    : `${node.skill.color}${Math.round(alpha * 80)
                        .toString(16)
                        .padStart(2, "0")}`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Label
                if (!isFiltered) {
                    ctx.font = `${(isHovered ? 12 : 10) * (availableRadius / 250)}px var(--font-inter), sans-serif`;
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(node.skill.name, x, y);
                }
            });
        },
        [activeCategory, hoveredSkill]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isVisible) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const rect = canvas.parentElement!.getBoundingClientRect();
            rectRef.current = { width: rect.width, height: rect.height };
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
        };
        resize();
        window.addEventListener("resize", resize);

        let running = true;
        const animate = (time: number) => {
            if (!running) return;
            timeRef.current = time; // Save for hover calculations
            draw(ctx, rectRef.current.width, rectRef.current.height, time);
            animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);

        return () => {
            running = false;
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [isVisible, draw]);

    // Mouse hover detection using animated positions
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const maxRadius = Math.min(rect.width, rect.height) / 2;
            const availableRadius = maxRadius - 30;

            let found: string | null = null;
            // Check in reverse to prefer nodes drawn last (on top)
            for (let i = nodesRef.current.length - 1; i >= 0; i--) {
                const node = nodesRef.current[i];
                // Hover detection fix: calculate exact same position as current animation frame
                const currentAngle = node.angle + timeRef.current * node.speed;
                const r = node.radius * availableRadius;

                const x = cx + Math.cos(currentAngle) * r;
                const y = cy + Math.sin(currentAngle) * r;
                const nodeSize = node.size * (availableRadius / 250);

                // Increase hit area slightly for better UX
                const hitRadius = nodeSize + 5;

                const dist = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
                if (dist < hitRadius) {
                    found = node.skill.name;
                    break;
                }
            }

            setHoveredSkill(found);
            // Cursor update
            if (canvas) {
                canvas.style.cursor = found ? "pointer" : "default";
            }
        },
        []
    );

    return (
        <section id="skills" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-dark-900" />

            <div ref={ref} className="relative max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="text-center mb-12"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neon-green/60 mb-3 block">
                        Expertise
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Skill <span className="gradient-text">Galaxy</span>
                    </h2>
                    <p className="text-white/40 max-w-lg mx-auto text-sm">
                        An interactive constellation of technologies I work with daily.
                    </p>
                </motion.div>

                {/* Category filter */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="flex flex-wrap items-center justify-center gap-2 mb-10"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${activeCategory === cat.key
                                ? "glass-strong text-white"
                                : "text-white/30 hover:text-white/60"
                                }`}
                            style={
                                activeCategory === cat.key
                                    ? { boxShadow: `0 0 15px ${cat.color}20`, borderColor: `${cat.color}30` }
                                    : undefined
                            }
                        >
                            {cat.label}
                        </button>
                    ))}
                </motion.div>

                {/* Canvas */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative w-full aspect-square max-w-lg mx-auto"
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-pointer"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoveredSkill(null)}
                    />
                </motion.div>

                {/* Mobile fallback grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-8 md:hidden">
                    {skills
                        .filter((s) => activeCategory === "all" || s.category === activeCategory)
                        .map((skill) => (
                            <div
                                key={skill.name}
                                className="glass rounded-lg p-3 text-center"
                                style={{ borderColor: `${skill.color}20` }}
                            >
                                <span className="text-xs font-medium text-white/70">{skill.name}</span>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
}
