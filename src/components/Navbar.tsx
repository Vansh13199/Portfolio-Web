"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#cloud", label: "Cloud" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#infra-viz", label: "Infra" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#pipeline", label: "Pipeline" },
    { href: "#contact", label: "Contact" },
];

export default function Navbar({ onReboot }: { onReboot?: () => void }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const sections = navLinks.map((l) => l.href.replace("#", ""));
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i]);
                if (el && el.getBoundingClientRect().top <= 120) {
                    setActiveSection(sections[i]);
                    break;
                }
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "glass-strong shadow-lg shadow-black/20"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <motion.a
                        href="#home"
                        className="flex items-center gap-2 group"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-sm font-bold text-dark-900">
                            {"</>"}
                        </div>
                        <span className="text-sm font-semibold tracking-wider text-white/90 group-hover:text-neon-cyan transition-colors">
                            VANSH.DEV
                        </span>
                    </motion.a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`relative px-3 py-2 text-xs font-medium tracking-wider uppercase transition-colors ${activeSection === link.href.replace("#", "")
                                    ? "text-neon-cyan"
                                    : "text-white/50 hover:text-white/80"
                                    }`}
                            >
                                {link.label}
                                {activeSection === link.href.replace("#", "") && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-neon-cyan rounded-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </a>
                        ))}

                        {/* Reboot System button */}
                        {onReboot && (
                            <motion.button
                                onClick={onReboot}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="ml-4 group relative px-3 py-1.5 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 hover:bg-neon-cyan/20 hover:border-neon-cyan/60 flex items-center gap-2 transition-all duration-300 cursor-pointer box-glow-cyan"
                                title="Reboot System"
                                aria-label="Reboot System"
                            >
                                <svg
                                    className="w-3.5 h-3.5 text-neon-cyan group-hover:animate-pulse"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 0a8 8 0 110 16 8 8 0 010-16z" />
                                </svg>
                                <span className="text-[10px] sm:text-xs font-bold text-neon-cyan tracking-widest uppercase">
                                    Reboot
                                </span>
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            className="w-5 h-px bg-white/70 block"
                        />
                        <motion.span
                            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-5 h-px bg-white/70 block"
                        />
                        <motion.span
                            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                            className="w-5 h-px bg-white/70 block"
                        />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 pt-20 bg-dark-900/95 backdrop-blur-xl md:hidden"
                    >
                        <div className="flex flex-col items-center gap-6 py-10">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-lg font-medium tracking-wider uppercase text-white/70 hover:text-neon-cyan transition-colors"
                                >
                                    {link.label}
                                </motion.a>
                            ))}

                            {/* Mobile Reboot Button */}
                            {onReboot && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: navLinks.length * 0.05 }}
                                    onClick={() => {
                                        setMobileOpen(false);
                                        onReboot();
                                    }}
                                    className="mt-4 px-6 py-3 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 flex items-center gap-3 box-glow-cyan"
                                >
                                    <svg
                                        className="w-5 h-5 text-neon-cyan animate-pulse"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 0a8 8 0 110 16 8 8 0 010-16z" />
                                    </svg>
                                    <span className="text-sm font-bold text-neon-cyan tracking-widest uppercase">
                                        Reboot System
                                    </span>
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
