"use client";

import { useState, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp } from "@/animations/scrollAnimations";

interface CommandLine {
    type: "input" | "output" | "error" | "success";
    text: string;
}

export default function ContactTerminal() {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
    const [history, setHistory] = useState<CommandLine[]>([
        { type: "output", text: "Welcome to the contact terminal." },
        { type: "output", text: 'Type your details or use the form fields below.\n' },
    ]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    const addLine = (line: CommandLine) => {
        setHistory((prev) => [...prev, line]);
        setTimeout(() => {
            terminalRef.current?.scrollTo({
                top: terminalRef.current.scrollHeight,
                behavior: "smooth",
            });
        }, 50);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            addLine({ type: "error", text: "Error: All fields are required." });
            return;
        }

        addLine({ type: "input", text: `send --name "${name}" --email "${email}"` });
        addLine({ type: "output", text: "Establishing connection..." });

        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 1500));

        addLine({ type: "success", text: "✓ Message queued for delivery." });
        addLine({
            type: "output",
            text: "Thank you! I'll get back to you soon.",
        });

        setIsSubmitting(false);
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <section id="contact" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-dark-900" />

            <div ref={ref} className="relative max-w-3xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neon-cyan/60 mb-3 block">
                        Connect
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Get In <span className="gradient-text">Touch</span>
                    </h2>
                    <p className="text-white/40 max-w-md mx-auto text-sm">
                        Have a project in mind or want to collaborate? Send a message.
                    </p>
                </motion.div>

                {/* Terminal */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="glass rounded-xl overflow-hidden"
                >
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                        <span className="ml-3 text-[10px] text-white/30 terminal-text">
                            vansh@dev-vansh.in ~ $
                        </span>
                    </div>

                    {/* Terminal output */}
                    <div
                        ref={terminalRef}
                        className="p-4 h-40 overflow-y-auto terminal-text text-xs space-y-1"
                    >
                        {history.map((line, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={
                                    line.type === "input"
                                        ? "text-neon-cyan"
                                        : line.type === "error"
                                            ? "text-red-400"
                                            : line.type === "success"
                                                ? "text-neon-green"
                                                : "text-white/40"
                                }
                            >
                                {line.type === "input" && (
                                    <span className="text-neon-green mr-1">❯</span>
                                )}
                                {line.text}
                            </motion.div>
                        ))}
                        {isSubmitting && (
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="text-neon-cyan"
                            >
                                Processing...
                            </motion.div>
                        )}
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-4 border-t border-white/5 space-y-3"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] text-white/30 terminal-text mb-1">
                                    --name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-xs text-white/80 terminal-text placeholder-white/20 focus:outline-none focus:border-neon-cyan/30 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-white/30 terminal-text mb-1">
                                    --email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-xs text-white/80 terminal-text placeholder-white/20 focus:outline-none focus:border-neon-cyan/30 transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] text-white/30 terminal-text mb-1">
                                --message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Your message..."
                                rows={3}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-xs text-white/80 terminal-text placeholder-white/20 focus:outline-none focus:border-neon-cyan/30 transition-colors resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20 text-xs font-semibold tracking-wider uppercase text-neon-cyan hover:from-neon-cyan/30 hover:to-neon-purple/30 transition-all disabled:opacity-50 terminal-text"
                        >
                            {isSubmitting ? "Sending..." : "❯ execute send_message"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
