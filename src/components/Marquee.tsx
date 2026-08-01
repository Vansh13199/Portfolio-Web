"use client";

import { useRef, useEffect, useState } from "react";

export default function Marquee() {
  const items = [
    "DynamoDB", "SNS", "SQS", "Lambda", "GraphQL", "WebSockets",
    "API Gateway", "AppSync", "Next.js", "TypeScript", "React",
    "Node.js", "IoT", "Serverless", "Docker", "CI/CD",
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf: number;
    const step = () => {
      setOffset((prev) => prev - 0.5);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Duplicate items for seamless loop
  const allItems = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-zinc-800/60 py-4 bg-zinc-950/50">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex items-center gap-8 whitespace-nowrap"
        style={{ transform: `translateX(${offset % (items.length * 120)}px)` }}
      >
        {allItems.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm text-zinc-500 font-mono shrink-0">
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
