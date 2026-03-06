"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
    name: string;
    email: string;
    message: string;
}

interface SubmissionPipelineProps {
    formData: FormData;
    onComplete: (success: boolean) => void;
    onLog: (type: "output" | "success" | "error", text: string) => void;
}

const stages = [
    { id: "code", label: "Code", icon: "💻", description: "Packaging data..." },
    { id: "build", label: "Build", icon: "🔨", description: "Validating format..." },
    { id: "deploy", label: "Deploy", icon: "🚀", description: "Sending to server..." },
    { id: "mail", label: "Mail Server", icon: "📨", description: "Delivering email..." },
];

export default function SubmissionPipeline({
    formData,
    onComplete,
    onLog,
}: SubmissionPipelineProps) {
    const [activeStage, setActiveStage] = useState(-1);
    const [status, setStatus] = useState<"running" | "success" | "error">("running");
    const [packetX, setPacketX] = useState(0);
    const hasRun = useRef(false);

    const runPipeline = useCallback(async () => {
        const stageDelay = (ms: number) =>
            new Promise((r) => setTimeout(r, ms));

        // Stage 0: Code — packaging
        setActiveStage(0);
        setPacketX(0);
        onLog("output", "⚡ Pipeline initiated — packaging data...");
        await stageDelay(900);

        // Stage 1: Build — validating
        setActiveStage(1);
        setPacketX(1);
        onLog("output", "🔨 Build stage — validating & formatting...");
        await stageDelay(900);

        // Stage 2: Deploy — actual API call
        setActiveStage(2);
        setPacketX(2);
        onLog("output", "🚀 Deploy stage — sending to server...");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!data.success) {
                setStatus("error");
                onLog("error", `✗ Deployment failed: ${data.error || "Unknown error"}`);
                onComplete(false);
                return;
            }
        } catch {
            setStatus("error");
            onLog("error", "✗ Deployment failed: Network error");
            onComplete(false);
            return;
        }

        // Stage 3: Mail Server — delivered
        setActiveStage(3);
        setPacketX(3);
        onLog("output", "📨 Mail server — delivering email...");
        await stageDelay(800);

        // Success
        setStatus("success");
        setActiveStage(4);
        onLog("success", "✓ Deployment successful — message delivered!");
        onLog("output", "Thank you! I'll get back to you soon.");
        onComplete(true);
    }, [formData, onComplete, onLog]);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        runPipeline();
    }, [runPipeline]);

    const getStageColor = (index: number) => {
        if (status === "error" && index >= activeStage) return "#ff4444";
        if (status === "success") return "#39ff14";
        if (index < activeStage) return "#39ff14";
        if (index === activeStage) return "#00f0ff";
        return "#333";
    };

    const getStageOpacity = (index: number) => {
        if (index <= activeStage) return 1;
        return 0.3;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-3 mx-1 select-none"
        >
            {/* Pipeline visualization */}
            <div className="relative flex items-center justify-between py-3 px-2">
                {/* Connection lines */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="none"
                >
                    {stages.slice(0, -1).map((_, i) => {
                        const x1 = `${(i / (stages.length - 1)) * 100 + 100 / (stages.length - 1) / 2}%`;
                        const x2 = `${((i + 1) / (stages.length - 1)) * 100 - 100 / (stages.length - 1) / 2}%`;
                        const lineColor =
                            i < activeStage
                                ? status === "error" && i >= activeStage - 1
                                    ? "#ff4444"
                                    : "#39ff14"
                                : i === activeStage - 1
                                    ? "#00f0ff"
                                    : "#222";
                        return (
                            <motion.line
                                key={i}
                                x1={x1}
                                y1="50%"
                                x2={x2}
                                y2="50%"
                                stroke={lineColor}
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0.3 }}
                                animate={{
                                    pathLength: i < activeStage ? 1 : 0,
                                    opacity: i < activeStage ? 1 : 0.3,
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        );
                    })}
                </svg>

                {/* Data packet */}
                <motion.div
                    className="absolute w-2.5 h-2.5 rounded-full z-20 pointer-events-none"
                    style={{
                        backgroundColor: status === "error" ? "#ff4444" : "#00f0ff",
                        boxShadow:
                            status === "error"
                                ? "0 0 12px #ff444480, 0 0 24px #ff444440"
                                : "0 0 12px #00f0ff80, 0 0 24px #00f0ff40",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                    animate={{
                        left: `${(packetX / (stages.length - 1)) * 100}%`,
                        scale: [1, 1.4, 1],
                    }}
                    transition={{
                        left: { duration: 0.6, ease: "easeInOut" },
                        scale: { duration: 0.8, repeat: Infinity },
                    }}
                />

                {/* Stage nodes */}
                {stages.map((stage, i) => (
                    <motion.div
                        key={stage.id}
                        className="relative z-10 flex flex-col items-center"
                        style={{ width: `${100 / stages.length}%` }}
                        animate={{
                            opacity: getStageOpacity(i),
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Stage circle */}
                        <motion.div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm border relative"
                            style={{
                                borderColor: getStageColor(i),
                                background:
                                    i === activeStage && status === "running"
                                        ? `${getStageColor(i)}15`
                                        : status === "success"
                                            ? "#39ff1410"
                                            : "rgba(10,10,15,0.9)",
                            }}
                            animate={
                                i === activeStage && status === "running"
                                    ? {
                                        scale: [1, 1.1, 1],
                                        boxShadow: [
                                            `0 0 0px ${getStageColor(i)}00`,
                                            `0 0 16px ${getStageColor(i)}60`,
                                            `0 0 0px ${getStageColor(i)}00`,
                                        ],
                                    }
                                    : status === "success"
                                        ? {
                                            boxShadow: `0 0 12px #39ff1440`,
                                        }
                                        : {}
                            }
                            transition={{
                                duration: 1,
                                repeat: i === activeStage && status === "running" ? Infinity : 0,
                            }}
                        >
                            {/* Success checkmark overlay */}
                            <AnimatePresence>
                                {status === "success" && i <= activeStage && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-neon-green flex items-center justify-center"
                                        style={{ fontSize: "7px", color: "#0a0a0f" }}
                                    >
                                        ✓
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {/* Error X overlay */}
                            <AnimatePresence>
                                {status === "error" && i === activeStage && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                                        style={{
                                            fontSize: "7px",
                                            color: "#0a0a0f",
                                            backgroundColor: "#ff4444",
                                        }}
                                    >
                                        ✗
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {stage.icon}
                        </motion.div>

                        {/* Label */}
                        <span
                            className="mt-1.5 text-[9px] terminal-text font-semibold tracking-wide"
                            style={{ color: getStageColor(i) }}
                        >
                            {stage.label}
                        </span>

                        {/* Active description */}
                        <AnimatePresence>
                            {i === activeStage && status === "running" && (
                                <motion.span
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[8px] terminal-text text-white/40 mt-0.5 whitespace-nowrap"
                                >
                                    {stage.description}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Status bar */}
            <div className="mt-1 mx-2">
                <div className="h-[2px] rounded-full overflow-hidden bg-white/5">
                    <motion.div
                        className="h-full rounded-full"
                        style={{
                            background:
                                status === "error"
                                    ? "#ff4444"
                                    : status === "success"
                                        ? "#39ff14"
                                        : "linear-gradient(90deg, #00f0ff, #a855f7)",
                        }}
                        initial={{ width: "0%" }}
                        animate={{
                            width:
                                status === "success"
                                    ? "100%"
                                    : `${(Math.max(0, activeStage) / stages.length) * 100}%`,
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
