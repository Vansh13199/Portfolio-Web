import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "neon-cyan": "#00f0ff",
                "neon-purple": "#a855f7",
                "neon-green": "#39ff14",
                "neon-pink": "#ff00ff",
                "neon-blue": "#4361ee",
                "dark-900": "#0a0a0f",
                "dark-800": "#0f0f1a",
                "dark-700": "#161625",
                "dark-600": "#1e1e35",
                "dark-500": "#2a2a45",
                glass: "rgba(255, 255, 255, 0.05)",
                "glass-border": "rgba(255, 255, 255, 0.08)",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                mono: ["var(--font-jetbrains)", "monospace"],
            },
            animation: {
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                float: "float 6s ease-in-out infinite",
                "float-delayed": "float 6s ease-in-out 3s infinite",
                "spin-slow": "spin 20s linear infinite",
                "fade-in": "fade-in 0.6s ease-out forwards",
                "slide-up": "slide-up 0.6s ease-out forwards",
                "typing-cursor": "typing-cursor 1s step-end infinite",
                "data-flow": "data-flow 2s linear infinite",
                orbit: "orbit 15s linear infinite",
            },
            keyframes: {
                "pulse-glow": {
                    "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
                    "50%": { opacity: "1", transform: "scale(1.05)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "slide-up": {
                    from: { opacity: "0", transform: "translateY(30px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "typing-cursor": {
                    "0%, 100%": { borderColor: "transparent" },
                    "50%": { borderColor: "#00f0ff" },
                },
                "data-flow": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(400%)" },
                },
                orbit: {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                },
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};

export default config;
