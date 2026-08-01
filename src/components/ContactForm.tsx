"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-0 py-3 bg-transparent border-b border-zinc-800 text-[15px] text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors";

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-4">
              Get in touch
            </h2>
            <p className="text-[15px] text-zinc-400 leading-relaxed mb-8">
              Interested in working together, have a question about my projects,
              or just want to say hi? I&apos;ll try to respond within a day.
            </p>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:vansh@dev-vansh.in"
                className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
              >
                <span className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-zinc-700 transition-colors text-xs">
                  @
                </span>
                vansh@dev-vansh.in
              </a>
              <a
                href="https://www.linkedin.com/in/vansh13199/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
              >
                <span className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-zinc-700 transition-colors text-xs">
                  in
                </span>
                LinkedIn
              </a>
              <a
                href="https://github.com/vansh13199"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
              >
                <span className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-zinc-700 transition-colors font-mono text-xs">
                  gh
                </span>
                GitHub
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className={inputClass}
                />
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={inputClass}
                />
              </div>
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className={inputClass}
              />
              <textarea
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                className={`${inputClass} resize-none`}
              />

              <div className="pt-6 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="px-6 py-2.5 text-sm font-medium bg-white text-zinc-900 rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-40"
                >
                  {status === "sending" ? "Sending..." : "Send message"}
                </button>

                {status === "sent" && (
                  <span className="text-sm text-emerald-400">Sent — I'll get back to you</span>
                )}
                {status === "error" && (
                  <span className="text-sm text-red-400">
                    Failed. Try{" "}
                    <a href="mailto:vansh@dev-vansh.in" className="underline">
                      emailing directly
                    </a>
                    .
                  </span>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
