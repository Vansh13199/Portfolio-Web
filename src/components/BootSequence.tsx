"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

/* ───────────────────── data ───────────────────── */

const BIOS_LINES = [
    "VANSH_OS  v4.2.0  —  ADVANCED BOOT MANAGER",
    "═══════════════════════════════════════════════════",
    "",
    "POST — Power-On Self Test .............................. [ OK ]",
    "BIOS Version 4.2.0-nightly-2026.03.06 (Vansh Corp.)",
    "",
    "Detecting CPU .......... AMD EPYC 9654 96-Core @ 3.7 GHz  [ OK ]",
    "Detecting Memory ....... 512 GB DDR5-4800 ECC Registered   [ OK ]",
    "Memory Test ............ 524288 MB OK",
    "GPU Init ............... NVIDIA H100 80GB SXM5 x4          [ OK ]",
    "NVMe Storage ........... 30.72 TB (8x 3.84TB NVMe RAID-0) [ OK ]",
    "Network Adapters ....... 4x 100GbE Mellanox ConnectX-7     [ OK ]",
    "TPM 2.0 Module ......... Verified                          [ OK ]",
    "Secure Boot ............ Enabled                            [ OK ]",
    "",
    "All hardware checks passed. Handing off to bootloader...",
    "",
];

const KERNEL_LINES = [
    { text: "Loading kernel image vmlinuz-6.8.0-vansh ...", status: "OK" },
    { text: "Mounting root filesystem (btrfs) ...........", status: "OK" },
    { text: "Starting systemd v255 ..................", status: "OK" },
    { text: "Initializing Docker Engine 25.0.3 .........", status: "OK" },
    { text: "Starting containerd runtime ...............", status: "OK" },
    { text: "Connecting to Kubernetes API (v1.29.2) .....", status: "OK" },
    { text: "Loading kubeconfig /etc/kubernetes/admin.conf", status: "OK" },
    { text: "etcd cluster health check .................", status: "OK" },
    { text: "CoreDNS pods scheduled ....................", status: "OK" },
    { text: "Calico CNI network plugin .................", status: "OK" },
    { text: "Mounting NFS shares (/data, /backups) .....", status: "OK" },
    { text: "Starting Prometheus monitoring stack .......", status: "OK" },
    { text: "Grafana dashboard provisioning ............", status: "OK" },
    { text: "Terraform state sync ......................", status: "OK" },
    { text: "ArgoCD GitOps controller ..................", status: "OK" },
    { text: "Vault secrets engine unsealed ..............", status: "OK" },
    { text: "Istio service mesh sidecar injection ......", status: "OK" },
    { text: "All services operational. System ready.", status: "DONE" },
];

const HEX_CHARS = "0123456789ABCDEF";

/* ───────────────────── component ───────────────────── */

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const biosRef = useRef<HTMLDivElement>(null);
    const kernelRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const progressTextRef = useRef<HTMLSpanElement>(null);
    const matrixAnimRef = useRef<number>(0);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    /* all phase wrapper refs */
    const biosPhaseRef = useRef<HTMLDivElement>(null);
    const kernelPhaseRef = useRef<HTMLDivElement>(null);
    const matrixPhaseRef = useRef<HTMLDivElement>(null);
    const readyPhaseRef = useRef<HTMLDivElement>(null);

    /* ─── hex matrix rain ─── */
    const startMatrix = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const fontSize = 14;
        const cols = Math.floor(canvas.width / fontSize);
        const drops: number[] = Array(cols).fill(1);
        const speeds: number[] = Array.from({ length: cols }, () => Math.random() * 0.5 + 0.5);

        const draw = () => {
            ctx.fillStyle = "rgba(10, 10, 15, 0.08)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < drops.length; i++) {
                const char = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
                const brightness = Math.random();

                if (brightness > 0.95) {
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowColor = "#00f0ff";
                    ctx.shadowBlur = 15;
                } else if (brightness > 0.7) {
                    ctx.fillStyle = "#00f0ff";
                    ctx.shadowColor = "#00f0ff";
                    ctx.shadowBlur = 8;
                } else {
                    ctx.fillStyle = `rgba(0, 240, 255, ${0.15 + brightness * 0.35})`;
                    ctx.shadowBlur = 0;
                }

                ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                ctx.shadowBlur = 0;

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += speeds[i];
            }
            matrixAnimRef.current = requestAnimationFrame(draw);
        };
        draw();
    }, []);

    const stopMatrix = useCallback(() => {
        cancelAnimationFrame(matrixAnimRef.current);
    }, []);

    /* ─── master timeline ─── */
    useEffect(() => {
        // Small delay to ensure DOM is painted
        const startTimeout = setTimeout(() => {
            if (document.documentElement.classList.contains("skip-boot")) {
                onComplete();
                return;
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    stopMatrix();
                    onComplete();
                },
            });
            tlRef.current = tl;

            // All phases start hidden
            gsap.set([biosPhaseRef.current, kernelPhaseRef.current, matrixPhaseRef.current, readyPhaseRef.current], {
                autoAlpha: 0,
            });

            /* ─── Phase 0: Screen flicker ON (0.4s) ─── */
            tl.fromTo(
                biosPhaseRef.current,
                { autoAlpha: 0 },
                {
                    keyframes: [
                        { autoAlpha: 1, duration: 0.05 },
                        { autoAlpha: 0, duration: 0.05 },
                        { autoAlpha: 0.7, duration: 0.05 },
                        { autoAlpha: 0, duration: 0.05 },
                        { autoAlpha: 1, duration: 0.05 },
                        { autoAlpha: 0.5, duration: 0.03 },
                        { autoAlpha: 1, duration: 0.05 },
                    ],
                }
            );

            /* ─── Phase 1: BIOS POST ─── */
            tl.to(biosPhaseRef.current, { autoAlpha: 1, duration: 0.1 });
            tl.call(() => {
                const el = biosRef.current;
                if (!el) return;

                let idx = 0;
                const interval = setInterval(() => {
                    if (idx >= BIOS_LINES.length) {
                        clearInterval(interval);
                        return;
                    }
                    const line = document.createElement("div");
                    line.style.animation = "bootFadeInLine 0.05s ease-out";
                    const text = BIOS_LINES[idx];
                    if (text.includes("[ OK ]")) {
                        const parts = text.split("[ OK ]");
                        line.innerHTML = `${parts[0]}<span style="color:#39ff14;font-weight:bold">[ OK ]</span>`;
                    } else {
                        line.textContent = text;
                    }
                    el.appendChild(line);
                    el.scrollTop = el.scrollHeight;
                    idx++;
                }, 80);
            });
            tl.to({}, { duration: 1.5 }); // wait for BIOS lines

            /* ─── Phase 2: Kernel boot ─── */
            tl.to(biosPhaseRef.current, { autoAlpha: 0, duration: 0.15 });
            tl.to(kernelPhaseRef.current, { autoAlpha: 1, duration: 0.1 });
            tl.call(() => {
                const el = kernelRef.current;
                if (!el) return;

                let idx = 0;
                const interval = setInterval(() => {
                    if (idx >= KERNEL_LINES.length) {
                        clearInterval(interval);
                        return;
                    }
                    const entry = KERNEL_LINES[idx];
                    const line = document.createElement("div");
                    line.style.display = "flex";
                    line.style.justifyContent = "space-between";
                    line.style.gap = "16px";
                    line.style.animation = "bootFadeInLine 0.08s ease-out";

                    const statusColor = entry.status === "OK" ? "#39ff14" :
                        entry.status === "DONE" ? "#00f0ff" : "#facc15";
                    const statusWeight = entry.status === "DONE" ? "bold" : "normal";

                    line.innerHTML = `
                        <span style="color:rgba(255,255,255,0.6)">${entry.text}</span>
                        <span style="color:${statusColor};font-weight:${statusWeight}">[ ${entry.status} ]</span>
                    `;
                    el.appendChild(line);
                    el.scrollTop = el.scrollHeight;

                    // Update progress bar
                    const pct = Math.round(((idx + 1) / KERNEL_LINES.length) * 100);
                    if (progressRef.current) {
                        progressRef.current.style.width = `${pct}%`;
                    }
                    if (progressTextRef.current) {
                        progressTextRef.current.textContent = `${pct}%`;
                    }
                    idx++;
                }, 100);
            });
            tl.to({}, { duration: 2.0 }); // wait for kernel lines

            /* ─── Phase 3: Hex Matrix Rain ─── */
            tl.to(kernelPhaseRef.current, { autoAlpha: 0, duration: 0.15 });
            tl.to(matrixPhaseRef.current, { autoAlpha: 1, duration: 0.1 });
            tl.call(() => startMatrix());
            tl.to({}, { duration: 1.2 });

            /* ─── Phase 4: SYSTEM ONLINE ─── */
            tl.call(() => stopMatrix());
            tl.to(matrixPhaseRef.current, { autoAlpha: 0, duration: 0.2 });
            tl.to(readyPhaseRef.current, { autoAlpha: 1, duration: 0.1 });

            // Glitch the title in
            tl.fromTo(
                ".boot-ready-title",
                {
                    opacity: 0,
                    scaleX: 1.3,
                    skewX: 20,
                    filter: "blur(10px)",
                },
                {
                    opacity: 1,
                    scaleX: 1,
                    skewX: 0,
                    filter: "blur(0px)",
                    duration: 0.4,
                    ease: "power4.out",
                }
            );

            // Glitch flicker
            tl.to(".boot-ready-title", {
                keyframes: [
                    { x: -4, skewX: -2, duration: 0.05 },
                    { x: 6, skewX: 3, duration: 0.05 },
                    { x: -2, skewX: -1, duration: 0.05 },
                    { x: 0, skewX: 0, duration: 0.05 },
                ],
            });

            tl.to(".boot-ready-subtitle", {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
            }, "-=0.1");

            // Hold
            tl.to({}, { duration: 0.6 });

            /* ─── Phase 5: Reveal ─── */
            tl.to(containerRef.current, {
                autoAlpha: 0,
                scale: 1.05,
                filter: "blur(8px)",
                duration: 0.6,
                ease: "power3.in",
            });
        }, 100);

        return () => {
            clearTimeout(startTimeout);
            if (tlRef.current) {
                tlRef.current.kill();
            }
            stopMatrix();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={containerRef}
            className="boot-container"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                backgroundColor: "#050508",
                overflow: "hidden",
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            }}
        >
            {/* CRT scanlines overlay */}
            <div
                style={{
                    pointerEvents: "none",
                    position: "absolute",
                    inset: 0,
                    zIndex: 50,
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                }}
            />

            {/* Horizontal sweep scanline */}
            <div
                style={{
                    pointerEvents: "none",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    height: "2px",
                    top: 0,
                    background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.6), rgba(168,85,247,0.4), transparent)",
                    boxShadow: "0 0 30px 10px rgba(0,240,255,0.15)",
                    animation: "bootScanline 5.5s linear forwards",
                }}
            />

            {/* ── BIOS Phase ── */}
            <div ref={biosPhaseRef} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "24px 40px", visibility: "hidden", opacity: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", opacity: 0.7 }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                        {[0, 1, 2].map((i) => (
                            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(57,255,20,0.6)" }} />
                        ))}
                    </div>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                        vansh_os boot manager — tty0
                    </span>
                </div>
                <div
                    ref={biosRef}
                    style={{
                        flex: 1,
                        overflow: "hidden",
                        fontSize: "12px",
                        lineHeight: "1.6",
                        color: "rgba(57,255,20,0.8)",
                    }}
                />
            </div>

            {/* ── Kernel Phase ── */}
            <div ref={kernelPhaseRef} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "24px 40px", visibility: "hidden", opacity: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "10px", color: "rgba(0,240,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                        kernel boot — systemd init
                    </span>
                </div>
                <div
                    ref={kernelRef}
                    style={{
                        flex: 1,
                        overflow: "hidden",
                        fontSize: "12px",
                        lineHeight: "1.6",
                    }}
                />
                {/* Progress bar */}
                <div style={{ marginTop: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                            System Init Progress
                        </span>
                        <span ref={progressTextRef} style={{ fontSize: "10px", color: "#00f0ff", fontWeight: "bold" }}>
                            0%
                        </span>
                    </div>
                    <div style={{ height: 4, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "9999px", overflow: "hidden" }}>
                        <div
                            ref={progressRef}
                            style={{
                                height: "100%",
                                borderRadius: "9999px",
                                width: "0%",
                                transition: "width 0.1s",
                                background: "linear-gradient(90deg, #00f0ff, #a855f7)",
                                boxShadow: "0 0 20px rgba(0,240,255,0.5)",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Matrix Phase ── */}
            <div ref={matrixPhaseRef} style={{ position: "absolute", inset: 0, visibility: "hidden", opacity: 0 }}>
                <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                {/* Center ring overlay */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "relative" }}>
                        <div
                            style={{
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                border: "1px solid rgba(0,240,255,0.2)",
                                animation: "spin 4s linear infinite",
                                boxShadow: "0 0 60px rgba(0,240,255,0.1), inset 0 0 60px rgba(0,240,255,0.05)",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                inset: 24,
                                borderRadius: "50%",
                                border: "1px solid rgba(168,85,247,0.3)",
                                animation: "spin 3s linear infinite reverse",
                                boxShadow: "0 0 40px rgba(168,85,247,0.1)",
                            }}
                        />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    backgroundColor: "#00f0ff",
                                    boxShadow: "0 0 30px 10px rgba(0,240,255,0.4)",
                                    animation: "bootPulse 1.5s ease-in-out infinite",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── System Online Phase ── */}
            <div ref={readyPhaseRef} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", visibility: "hidden", opacity: 0 }}>
                {/* Radial glow */}
                <div
                    style={{
                        position: "absolute",
                        width: 600,
                        height: 600,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)",
                    }}
                />

                {/* Main text */}
                <div style={{ position: "relative", textAlign: "center", zIndex: 10 }}>
                    <h1
                        className="boot-ready-title"
                        style={{
                            fontSize: "clamp(48px, 10vw, 128px)",
                            fontWeight: 900,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            lineHeight: 1.1,
                            background: "linear-gradient(135deg, #00f0ff, #a855f7, #ff00ff)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: "drop-shadow(0 0 40px rgba(0,240,255,0.3))",
                            opacity: 0,
                        }}
                    >
                        SYSTEM<br />ONLINE
                    </h1>
                    <p
                        className="boot-ready-subtitle"
                        style={{
                            marginTop: 16,
                            fontSize: "clamp(10px, 1.5vw, 14px)",
                            letterSpacing: "0.5em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.4)",
                            opacity: 0,
                            transform: "translateY(10px)",
                        }}
                    >
                        All services operational
                    </p>
                </div>

                {/* Corner brackets */}
                {[
                    { top: 24, left: 24, borderTop: "2px solid rgba(0,240,255,0.2)", borderLeft: "2px solid rgba(0,240,255,0.2)" },
                    { top: 24, right: 24, borderTop: "2px solid rgba(0,240,255,0.2)", borderRight: "2px solid rgba(0,240,255,0.2)" },
                    { bottom: 24, right: 24, borderBottom: "2px solid rgba(0,240,255,0.2)", borderRight: "2px solid rgba(0,240,255,0.2)" },
                    { bottom: 24, left: 24, borderBottom: "2px solid rgba(0,240,255,0.2)", borderLeft: "2px solid rgba(0,240,255,0.2)" },
                ].map((style, i) => (
                    <div key={i} style={{ position: "absolute", width: 48, height: 48, ...style }} />
                ))}

                {/* Status indicators */}
                <div style={{
                    position: "absolute",
                    bottom: 40,
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                }}>
                    {["Network", "Cluster", "Security"].map((label) => (
                        <span key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: "#39ff14",
                                animation: "bootPulse 2s ease-in-out infinite",
                            }} />
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Global keyframes injected via style tag */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    html.skip-boot .boot-container {
                        display: none !important;
                    }
                    @keyframes bootFadeInLine {
                        from { opacity: 0; transform: translateX(-8px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes bootScanline {
                        from { top: 0%; }
                        to { top: 100%; }
                    }
                    @keyframes bootPulse {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.2); }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `
            }} />
        </div>
    );
}
