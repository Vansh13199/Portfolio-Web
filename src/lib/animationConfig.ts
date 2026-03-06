export const animationConfig = {
    duration: {
        fast: 0.3,
        normal: 0.6,
        slow: 1.0,
        verySlow: 1.5,
    },
    ease: {
        smooth: [0.25, 0.1, 0.25, 1] as const,
        bounce: [0.68, -0.55, 0.265, 1.55] as const,
        sharp: [0.4, 0, 0.2, 1] as const,
        elastic: [0.175, 0.885, 0.32, 1.275] as const,
    },
    stagger: {
        fast: 0.05,
        normal: 0.1,
        slow: 0.15,
    },
    threshold: {
        section: 0.1,
        card: 0.2,
        text: 0.3,
    },
};
