"use client";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
        <span>Vansh © {new Date().getFullYear()}</span>
        <span className="font-mono">Next.js · Tailwind · Resend</span>
      </div>
    </footer>
  );
}
