"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-end pb-16 px-6 overflow-hidden">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      {/* Subtle radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col gap-16"
        >
          {/* Main headline + intro */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
            <div className="max-w-2xl">
              <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-tight">
                Vansh, builds
                <br />
                <span className="text-zinc-500">cloud systems</span>
                <br />
                that ship.
              </h1>
            </div>

            <div className="lg:max-w-xs lg:pb-2 space-y-5">
              <p className="text-[15px] leading-relaxed text-zinc-400">
                Full-stack developer focused on AWS, real-time architectures,
                and IoT. Currently building{" "}
                <a
                  href="https://lander.dev-vansh.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline decoration-zinc-600 underline-offset-4 hover:decoration-emerald-500 transition-colors"
                >
                  Suraksha+
                </a>
                .
              </p>
              <div className="flex gap-4">
                {[
                  { label: "GitHub", url: "https://github.com/vansh13199" },
                  { label: "LinkedIn", url: "https://www.linkedin.com/in/vansh13199/" },
                  { label: "LeetCode", url: "https://leetcode.com/u/vansh13199/" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal-style window */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
              <span className="text-xs text-zinc-600 font-mono ml-2">~/vansh — zsh</span>
            </div>
            {/* Terminal content */}
            <div className="px-5 py-4 font-mono text-sm leading-7 text-zinc-400 overflow-x-auto">
              <div><span className="text-emerald-400">➜</span> <span className="text-zinc-300">cat about.json</span></div>
              <div className="text-zinc-600">{"{"}</div>
              <div>  <span className="text-zinc-500">&quot;name&quot;</span>: <span className="text-emerald-400">&quot;Vansh&quot;</span>,</div>
              <div>  <span className="text-zinc-500">&quot;role&quot;</span>: <span className="text-emerald-400">&quot;Cloud Engineer&quot;</span>,</div>
              <div>  <span className="text-zinc-500">&quot;focus&quot;</span>: [<span className="text-emerald-400">&quot;AWS&quot;</span>, <span className="text-emerald-400">&quot;Real-time Systems&quot;</span>, <span className="text-emerald-400">&quot;IoT&quot;</span>],</div>
              <div>  <span className="text-zinc-500">&quot;current&quot;</span>: <span className="text-emerald-400">&quot;Suraksha+ — IoT safety platform&quot;</span>,</div>
              <div>  <span className="text-zinc-500">&quot;email&quot;</span>: <span className="text-emerald-400">&quot;vansh@dev-vansh.in&quot;</span></div>
              <div className="text-zinc-600">{"}"}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
