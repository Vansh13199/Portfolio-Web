"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-semibold text-white mb-12"
        >
          About
        </motion.h2>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main bio — spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950 p-8"
          >
            <div className="space-y-4 text-[15px] leading-relaxed text-zinc-400">
              <p>
                I got into cloud engineering because I wanted to understand what
                happens after you hit deploy. Most of my time goes into
                designing backends on AWS — writing Lambda functions, modeling
                DynamoDB tables, and wiring up event-driven pipelines that stay
                up at 3 AM.
              </p>
              <p>
                My biggest project is{" "}
                <span className="text-white">Suraksha+</span>, an IoT safety
                ecosystem combining custom hardware sensors with a cloud backend
                for real-time emergency response. I designed the full stack —
                from PCB circuitry to the GraphQL API.
              </p>
            </div>
          </motion.div>

          {/* Location / availability card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-3">Location</div>
              <div className="text-white text-lg font-medium">India 🇮🇳</div>
              <div className="text-sm text-zinc-500 mt-1">IST (UTC+5:30)</div>
            </div>
            <div className="mt-8">
              <div className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-3">Status</div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-zinc-300">Open to work</span>
              </div>
            </div>
          </motion.div>

          {/* Stack */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-8"
          >
            <div className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-5">Cloud</div>
            <div className="space-y-2.5">
              {["DynamoDB", "SNS / SQS", "Lambda", "AppSync", "API Gateway", "CloudFormation"].map((t) => (
                <div key={t} className="text-sm text-zinc-400 flex items-center gap-2.5">
                  <span className="w-1 h-4 rounded-full bg-emerald-500/40" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stack 2 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-8"
          >
            <div className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-5">Dev</div>
            <div className="space-y-2.5">
              {["TypeScript", "Next.js / React", "Node.js", "GraphQL", "WebSockets", "Tailwind CSS"].map((t) => (
                <div key={t} className="text-sm text-zinc-400 flex items-center gap-2.5">
                  <span className="w-1 h-4 rounded-full bg-zinc-700" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tools / other */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-8"
          >
            <div className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-5">Tools</div>
            <div className="space-y-2.5">
              {["Git / GitHub", "Docker", "IoT / Embedded", "Figma", "Linux / Bash", "CI/CD Pipelines"].map((t) => (
                <div key={t} className="text-sm text-zinc-400 flex items-center gap-2.5">
                  <span className="w-1 h-4 rounded-full bg-zinc-700" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
