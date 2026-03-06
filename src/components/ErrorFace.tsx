"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const ErrorFace = ({ className = "" }: { className?: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // Mouse position tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for the eye movement
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const eyeX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
    const eyeY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || !isHovered) return;
            const rect = containerRef.current.getBoundingClientRect();
            const clientX = e.clientX;
            const clientY = e.clientY;

            // Calculate continuous relative position (-0.5 to 0.5) from center
            const xPos = (clientX - rect.left - rect.width / 2) / rect.width;
            const yPos = (clientY - rect.top - rect.height / 2) / rect.height;

            mouseX.set(xPos);
            mouseY.set(yPos);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isHovered, mouseX, mouseY]);

    useEffect(() => {
        if (!isHovered) {
            // Return to center when not hovering
            mouseX.set(0);
            mouseY.set(0);
        }
    }, [isHovered, mouseX, mouseY]);

    const toggleClickAnimation = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 500); // Reset after jolt
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full max-w-[400px] aspect-[1/1] cursor-pointer touch-none ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={toggleClickAnimation}
        >
            <motion.svg
                viewBox="0 0 400 400"
                className="w-full h-full text-slate-800 dark:text-slate-200 drop-shadow-2xl"
                fill="none"
                stroke="currentColor"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: isHovered ? (isClicked ? 0.9 : 1.05) : 1,
                    rotate: isClicked ? [0, -5, 5, -5, 5, 0] : 0, // Shake when clicked!
                }}
                transition={{
                    duration: isClicked ? 0.4 : 0.6,
                    ease: "easeOut"
                }}
            >
                {/* Left Eye (4) */}
                <motion.g
                    style={{ x: eyeX, y: eyeY }} // Dynamic 3D tracking
                    animate={{ y: [0, -1, 0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", times: [0, 0.2, 0.4, 0.6, 1] }}
                >
                    {/* Vertical Stem */}
                    <path d="M 130 100 L 130 200" />
                    {/* Diagonal */}
                    <path d="M 130 100 L 70 170" />
                    {/* Horizontal */}
                    <path d="M 70 170 L 160 170" />
                    <path d="M 160 170 L 160 195" />

                    {/* Left Tears - Hide while clicked or massively hovering! */}
                    <motion.g animate={{ opacity: isClicked ? 0 : 1 }}>
                        <motion.path
                            d="M 160 195 Q 166 205 166 211 A 6 6 0 0 1 154 211 Q 154 205 160 195"
                            fill="#3b82f6"
                            stroke="none"
                            initial={{ opacity: 0, y: 0, scale: 0.3 }}
                            animate={{ opacity: [0, 1, 1, 0], y: [0, 20, 110, 130], scale: [0.3, 1.3, 0.8, 0] }}
                            transition={{ repeat: Infinity, duration: 2.4, ease: [0.4, 0, 0.2, 1], delay: 0 }}
                        />
                        <motion.path
                            d="M 160 195 Q 164 202 164 206 A 4 4 0 0 1 156 206 Q 156 202 160 195"
                            fill="#60a5fa"
                            stroke="none"
                            initial={{ opacity: 0, y: 0, scale: 0.2 }}
                            animate={{ opacity: [0, 0.8, 0], y: [0, 30, 80], scale: [0.2, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 1.2 }}
                        />
                    </motion.g>
                </motion.g>

                {/* Right Eye (Mirrored 4) */}
                <motion.g
                    style={{ x: eyeX, y: eyeY }} // Dynamic 3D tracking
                    animate={{ y: [0, -1, 0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.4, times: [0, 0.2, 0.4, 0.6, 1] }}
                >
                    {/* Vertical Stem */}
                    <path d="M 270 100 L 270 200" />
                    {/* Diagonal */}
                    <path d="M 270 100 L 330 170" />
                    {/* Horizontal */}
                    <path d="M 330 170 L 240 170" />
                    <path d="M 240 170 L 240 195" />

                    {/* Right Tears */}
                    <motion.g animate={{ opacity: isClicked ? 0 : 1 }}>
                        <motion.path
                            d="M 240 195 Q 246 205 246 211 A 6 6 0 0 1 234 211 Q 234 205 240 195"
                            fill="#3b82f6"
                            stroke="none"
                            initial={{ opacity: 0, y: 0, scale: 0.3 }}
                            animate={{ opacity: [0, 1, 1, 0], y: [0, 20, 110, 130], scale: [0.3, 1.3, 0.8, 0] }}
                            transition={{ repeat: Infinity, duration: 2.6, ease: [0.4, 0, 0.2, 1], delay: 0.7 }}
                        />
                        <motion.path
                            d="M 240 195 Q 244 202 244 206 A 4 4 0 0 1 236 206 Q 236 202 240 195"
                            fill="#60a5fa"
                            stroke="none"
                            initial={{ opacity: 0, y: 0, scale: 0.2 }}
                            animate={{ opacity: [0, 0.8, 0], y: [0, 30, 80], scale: [0.2, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.7, ease: [0.4, 0, 0.2, 1], delay: 1.8 }}
                        />
                    </motion.g>
                </motion.g>

                {/* Nose (0) - Tweaked slightly on Hover */}
                <motion.rect
                    x="180" y="140" width="40" height="120" rx="20"
                    animate={{
                        scaleY: isHovered ? 1.05 : [1, 1.03, 0.98, 1],
                        y: [0, -1, 2, 0],
                        scaleX: isClicked ? 1.2 : 1  // Nose flare on click!
                    }}
                    transition={{ repeat: isHovered && !isClicked ? 0 : Infinity, duration: 3.5 }}
                    style={{ transformOrigin: "200px 200px" }}
                />

                {/* Mouth (Sad Curve) */}
                <motion.path
                    d="M 120 320 Q 200 270 280 320"
                    animate={{
                        d: isClicked
                            ? "M 140 330 Q 200 350 260 330" // Oh face / sharp drop when clicked
                            : isHovered
                                ? "M 130 310 Q 200 290 270 310" // Stiff/surprised sad face on hover 
                                : [
                                    "M 120 320 Q 200 270 280 320",
                                    "M 125 315 Q 200 280 275 315",
                                    "M 115 325 Q 200 265 285 325",
                                    "M 120 320 Q 200 270 280 320"
                                ]
                    }}
                    transition={{
                        duration: isHovered ? 0.4 : 4,
                        repeat: isHovered ? 0 : Infinity,
                        ease: "easeOut"
                    }}
                />
            </motion.svg>
        </div>
    );
};
