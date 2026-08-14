import type { Metadata } from "next";
import ExploreChat from "@/components/ExploreChat";

export const metadata: Metadata = {
  title: "Explore — Ask Vansh's AI",
  description:
    "Chat with an AI assistant to learn about Vansh — his projects, cloud engineering expertise, tech stack, and how to get in touch.",
  openGraph: {
    title: "Explore — Ask Vansh's AI",
    description:
      "Chat with an AI assistant to learn about Vansh, his cloud engineering projects, and expertise.",
    type: "website",
  },
};

export default function ExplorePage() {
  return <ExploreChat />;
}
