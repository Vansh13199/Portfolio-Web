"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background,border-color] duration-300 ${
        scrolled
          ? "bg-[#09090b]/80 backdrop-blur-md border-b border-[#27272a]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="font-mono text-sm text-zinc-400 hover:text-white transition-colors">
          ~/vansh
        </a>

        <div className="flex items-center gap-6">
          {/* Explore button with animated gradient outline */}
          <a
            href="/explore"
            className="relative hidden sm:inline-flex items-center justify-center group"
          >
            {/* Animated gradient border */}
            <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_var(--gradient-angle),#10b981,#6366f1,#ec4899,#f59e0b,#10b981)] p-[1px] animate-[spin-gradient_3s_linear_infinite]">
              <span className="flex h-full w-full rounded-full bg-[#09090b] group-hover:bg-zinc-900/80 transition-colors" />
            </span>
            <span className="relative z-10 px-4 py-1.5 text-sm text-zinc-300 group-hover:text-white transition-colors">
              ✦ Explore
            </span>
          </a>

          {[
            { label: "Work", href: "#work" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-zinc-500 hover:text-white transition-colors hidden sm:block"
            >
              {l.label}
            </a>
          ))}

        </div>
      </nav>
    </header>
  );
}
