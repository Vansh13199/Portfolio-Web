"use client";

import { motion } from "framer-motion";

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const LeetcodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

export default function SocialLinks() {
  const links = [
    {
      label: "GitHub",
      handle: "vansh13199",
      url: "https://github.com/vansh13199",
      icon: <GithubIcon />,
    },
    {
      label: "LinkedIn",
      handle: "in/vansh13199",
      url: "https://www.linkedin.com/in/vansh13199/",
      icon: <LinkedinIcon />,
    },
    {
      label: "LeetCode",
      handle: "vansh13199",
      url: "https://leetcode.com/u/vansh13199/",
      icon: <LeetcodeIcon />,
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-[13px] font-mono text-[#e5a03e] uppercase tracking-wider mb-2">
            Elsewhere
          </h2>
          <p className="text-[28px] sm:text-[32px] font-semibold text-white tracking-tight mb-8">
            Find me online
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#999] border border-[#262626] rounded-lg hover:border-[#444] hover:text-white transition-all group"
            >
              <span className="text-[#666] group-hover:text-white transition-colors">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              <span className="text-[#555] text-[13px] font-mono hidden sm:inline">
                @{item.handle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
