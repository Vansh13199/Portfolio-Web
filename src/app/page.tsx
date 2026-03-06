"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import BootSequence from "@/components/BootSequence";

// Lazy load heavier sections for performance
const CloudVisualization = dynamic(
    () => import("@/components/CloudVisualization"),
    { ssr: false }
);
const AboutSection = dynamic(() => import("@/components/AboutSection"));
const SkillsGalaxy = dynamic(() => import("@/components/SkillsGalaxy"), {
    ssr: false,
});
const InteractiveKubernetesCluster = dynamic(
    () => import("@/components/InteractiveKubernetesCluster"),
    { ssr: false }
);
const InfrastructureMap = dynamic(
    () => import("@/components/InfrastructureMap"),
    { ssr: false }
);
const Timeline = dynamic(() => import("@/components/Timeline"));
const Projects = dynamic(() => import("@/components/Projects"));
const DevOpsPipeline = dynamic(() => import("@/components/DevOpsPipeline"));
const ContactTerminal = dynamic(
    () => import("@/components/ContactTerminal"),
    { ssr: false }
);

export default function Home() {
    const [booting, setBooting] = useState(true);

    const handleBootComplete = () => {
        sessionStorage.setItem("vansh_os_booted", "true");
        setBooting(false);
    };

    const handleReboot = () => {
        document.documentElement.classList.remove("skip-boot");
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        setBooting(true);
    };

    return (
        <main className="relative noise-overlay">
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            try {
                                var hasBooted = sessionStorage.getItem("vansh_os_booted");
                                var isReload = false;
                                var nav = performance.getEntriesByType("navigation")[0];
                                if (nav && nav.type === "reload" && nav.transferSize > 0) {
                                    isReload = true;
                                    sessionStorage.removeItem("vansh_os_booted");
                                }
                                if (hasBooted && !isReload) {
                                    document.documentElement.classList.add("skip-boot");
                                } else {
                                    document.documentElement.classList.remove("skip-boot");
                                }
                            } catch(e) {}
                        })();
                    `,
                }}
            />
            {booting && <BootSequence onComplete={handleBootComplete} />}
            <Navbar onReboot={handleReboot} />
            <HeroSection />
            <CloudVisualization />
            <AboutSection />
            <SkillsGalaxy />

            {/* Infrastructure Visualization — between Skills and Projects */}
            <section id="infra-viz" className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-dark-900 bg-dots" />
                <div className="relative max-w-7xl mx-auto px-6">
                    <InteractiveKubernetesCluster />
                    <InfrastructureMap />
                </div>
            </section>

            <Timeline />
            <Projects />
            <DevOpsPipeline />
            <ContactTerminal />
            <Footer />
        </main>
    );
}
