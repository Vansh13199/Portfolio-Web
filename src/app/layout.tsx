import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vansh — Cloud Engineer",
  description:
    "I build real-time cloud systems on AWS. Currently working on Suraksha+, an IoT safety platform, and scalable WebSocket architectures.",
  authors: [{ name: "Vansh", url: "https://github.com/vansh13199" }],
  openGraph: {
    title: "Vansh — Cloud Engineer",
    description:
      "Cloud Engineer building real-time cloud systems on AWS.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jbMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
