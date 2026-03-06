"use client";

import { useMousePosition } from "./useMousePosition";

interface ParallaxConfig {
    intensity?: number;
    invertX?: boolean;
    invertY?: boolean;
}

export function useParallax(config: ParallaxConfig = {}) {
    const { intensity = 1, invertX = false, invertY = false } = config;
    const { normalizedX, normalizedY } = useMousePosition();

    const x = normalizedX * 20 * intensity * (invertX ? -1 : 1);
    const y = normalizedY * 20 * intensity * (invertY ? -1 : 1);

    return {
        x,
        y,
        style: {
            transform: `translate(${x}px, ${y}px)`,
        } as React.CSSProperties,
    };
}
