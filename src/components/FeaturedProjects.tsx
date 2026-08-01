"use client";

import { motion } from "framer-motion";

export default function FeaturedProjects() {
  const projects = [
    {
      num: "01",
      title: "Suraksha+",
      tagline: "IoT safety platform for women",
      description:
        "A wearable device with 7 sensors — pulse, IMU, GPS, eSIM, contact trigger, tap controls, and custom PCB — paired with a mobile companion app. The cloud backend runs on AWS: DynamoDB for state, SNS/SQS for alert fan-out, AppSync for real-time GraphQL subscriptions. Emergency dispatch happens in under 2 seconds.",
      stack: ["AWS", "DynamoDB", "SNS/SQS", "GraphQL", "IoT", "Next.js"],
      links: [
        { label: "Lander", url: "https://lander.dev-vansh.in" },
        { label: "GitHub", url: "https://github.com/vansh13199/suraksha" },
      ],
      highlight: "7 sensors → cloud → alert in <2s",
    },
    {
      num: "02",
      title: "ChatFlow",
      tagline: "WebSocket messaging platform",
      description:
        "A fully serverless chat application using API Gateway WebSockets, Lambda handlers for connection lifecycle, and DynamoDB for message persistence and connection state. Supports presence detection, typing indicators, and message delivery confirmation — all without a single EC2 instance.",
      stack: ["WebSockets", "Lambda", "DynamoDB", "API Gateway", "TypeScript"],
      links: [
        { label: "Demo", url: "https://github.com/vansh13199/chatflow" },
        { label: "GitHub", url: "https://github.com/vansh13199/chatflow" },
      ],
      highlight: "100% serverless, zero EC2",
    },
  ];

  return (
    <section id="work" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-baseline justify-between mb-14"
        >
          <h2 className="text-2xl font-semibold text-white">Selected work</h2>
          <span className="text-xs font-mono text-zinc-600 hidden sm:block">
            {projects.length} projects
          </span>
        </motion.div>

        <div className="flex flex-col">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group border-t border-zinc-800 last:border-b"
            >
              <div className="block py-10 sm:py-12">
                {/* Top row — number, title, tagline, links */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6">
                  <span className="text-xs font-mono text-zinc-600 shrink-0 w-8">
                    {project.num}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                    {project.title}
                  </h3>
                  <span className="text-sm text-zinc-500 sm:ml-2">
                    — {project.tagline}
                  </span>
                  <div className="hidden sm:flex items-center gap-4 ml-auto">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-white transition-colors font-mono"
                      >
                        {link.label}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Bottom row — description + metadata */}
                <div className="flex flex-col lg:flex-row gap-8 sm:pl-8">
                  <p className="text-[15px] leading-relaxed text-zinc-400 max-w-xl flex-1">
                    {project.description}
                  </p>

                  <div className="lg:w-56 shrink-0 space-y-5">
                    {/* Highlight callout */}
                    <div className="px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800">
                      <div className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                        Key metric
                      </div>
                      <div className="text-sm text-emerald-400 font-medium font-mono">
                        {project.highlight}
                      </div>
                    </div>

                    {/* Stack tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800/60"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Mobile links */}
                  <div className="flex gap-4 sm:hidden mt-4">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-500 hover:text-white transition-colors font-mono"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
