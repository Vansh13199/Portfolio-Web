import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Vansh | DevOps Engineer & Cloud Architect",
    description:
        "Vansh — DevOps Engineer and Cloud Architect specializing in AWS, Azure, GCP, Kubernetes, and Infrastructure Automation. Building scalable, resilient cloud systems.",
    keywords: [
        "Vansh",
        "dev-vansh.in",
        "DevOps Engineer",
        "Cloud Architect",
        "AWS",
        "Azure",
        "GCP",
        "Kubernetes",
        "Docker",
        "Terraform",
        "CI/CD",
        "Infrastructure Automation",
    ],
    authors: [{ name: "Vansh" }],
    metadataBase: new URL("https://dev-vansh.in"),
    openGraph: {
        title: "Vansh | DevOps Engineer & Cloud Architect",
        description:
            "Building scalable cloud infrastructure and resilient DevOps systems.",
        type: "website",
        url: "https://dev-vansh.in",
    },
};

import MobileBlocker from "@/components/MobileBlocker";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
            >
                <MobileBlocker />
                {children}
                <SpeedInsights />
            </body>
        </html>
    );
}
