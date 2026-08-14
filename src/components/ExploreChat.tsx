"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What projects has Vansh built?",
  "What's his tech stack?",
  "Tell me about Suraksha+",
  "How can I contact Vansh?",
];

/* Reusable sparkle icon */
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
      />
    </svg>
  );
}

/* Reusable input bar */
function InputBar({
  input,
  setInput,
  onSend,
  onKeyDown,
  isLoading,
  textareaRef,
}: {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="flex items-end gap-3 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl px-4 py-3 focus-within:border-emerald-500/40 transition-colors duration-200 shadow-lg shadow-black/20">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask about Vansh..."
        rows={1}
        disabled={isLoading}
        className="flex-1 bg-transparent text-white text-[15px] placeholder:text-zinc-600 resize-none outline-none max-h-40 leading-relaxed disabled:opacity-50 mt-[3px]"
      />
      <button
        onClick={onSend}
        disabled={!input.trim() || isLoading}
        className="shrink-0 w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function ExploreChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  }, [input]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setIsLoading(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setError("Failed to connect. Please check your internet and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSend = () => sendMessage(input);

  /* ─── INITIAL STATE: Hero + centered input ─── */
  if (!hasMessages) {
    return (
      <div className="relative min-h-screen flex flex-col bg-[#09090b]">
        {/* BG */}
        <div className="fixed inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-3xl mx-auto w-full">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors font-mono group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            ~/vansh
          </a>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono text-zinc-600">AI powered</span>
          </div>
        </header>

        {/* Centered content */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-2xl flex flex-col items-center text-center"
          >
            {/* Glowing icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl scale-150" />
              <div className="relative w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <SparkleIcon className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
              Explore Vansh
            </h1>
            <p className="text-zinc-500 text-[15px] max-w-sm mb-8 leading-relaxed">
              Ask anything about his projects, skills, or experience.
            </p>

            {/* Input bar — centered in the middle */}
            <div className="w-full max-w-xl mb-6">
              <InputBar
                input={input}
                setInput={setInput}
                onSend={handleSend}
                onKeyDown={handleKeyDown}
                isLoading={isLoading}
                textareaRef={textareaRef}
              />
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-3.5 py-2 text-[13px] text-zinc-500 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-emerald-500/30 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all duration-200 cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-zinc-700 mt-6 font-mono">
              Powered by AI · Only answers about Vansh
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  /* ─── CHAT STATE: Messages + bottom-pinned input ─── */
  return (
    <div className="relative min-h-screen flex flex-col bg-[#09090b]">
      {/* BG */}
      <div className="fixed inset-0 dot-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 shrink-0 flex items-center justify-between px-6 py-5 max-w-3xl mx-auto w-full border-b border-zinc-800/50">
        <a
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors font-mono group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          ~/vansh
        </a>
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
          >
            New chat
          </button>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono text-zinc-600">AI powered</span>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-6">
        <div className="max-w-3xl mx-auto py-6 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] ${msg.role === "user"
                      ? "bg-emerald-500/10 border border-emerald-500/15 text-emerald-50"
                      : "bg-zinc-900/70 border border-zinc-800 text-zinc-300"
                    } rounded-2xl px-5 py-3.5`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <SparkleIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider">
                        Vansh AI
                      </span>
                    </div>
                  )}
                  <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <SparkleIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider">
                    Vansh AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-start"
              >
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[14px] text-red-400 max-w-[85%] sm:max-w-[70%]">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom input */}
      <div className="relative z-10 shrink-0 px-6 pb-8 pt-3 max-w-3xl mx-auto w-full">
        <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
        <InputBar
          input={input}
          setInput={setInput}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
          textareaRef={textareaRef}
        />
        <p className="text-center text-[11px] text-zinc-700 mt-3 font-mono">
          Powered by AI · Only answers about Vansh
        </p>
      </div>
    </div>
  );
}
