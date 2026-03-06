<div align="center">
  <img src="src/app/icon.tsx" alt="Logo" width="80" height="80" />
  
  <h1 align="center">Vansh.dev Portfolio</h1>

  <p align="center">
    A futuristic, high-performance, interactive developer portfolio built with Next.js 15, React 19, and Framer Motion. 
    <br />
    <br />
    <a href="https://github.com/Vansh13199/Portfolio-Web"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://vansh.dev">View Demo</a>
    ·
    <a href="https://github.com/Vansh13199/Portfolio-Web/issues">Report Bug</a>
    ·
    <a href="https://github.com/Vansh13199/Portfolio-Web/issues">Request Feature</a>
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
  </p>
</div>

<br />

## 🌟 About The Project

This project is a deeply interactive, highly immersive personal portfolio designed to stand out. Moving away from standard static sites, it integrates complex CSS/Canvas animations, interactive infrastructure visualizations, and a sleek cyberpunk/hacker aesthetic. 

The site is optimized for performance using Next.js App Router and dynamic imports to ensure buttery-smooth 60fps animations even with heavy visual effects.

### ✨ Key Features

*   **Terminal Boot Sequence:** A fully animated, jaw-dropping full-screen boot animation utilizing GSAP, Canvas Matrix Rain, and custom CSS keyframes.
*   **Interactive Cloud/Infra Viz:** Custom React components simulating Kubernetes clusters, CI/CD DevOps pipelines, and cloud architecture routing.
*   **Contact Terminal:** A functional, CLI-inspired contact form backed by the Resend API for seamless email delivery.
*   **Immersive Animations:** Scroll-driven reveal effects, stagger animations, and micro-interactions powered by Framer Motion.
*   **Neon Cyberpunk Aesthetic:** Custom CSS variables, glassmorphism, CRT scanlines, and animated gradients.

---

## 🛠️ Built With

This project leverages the latest cutting-edge web technologies:

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **UI Library:** [React 19](https://react.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations 1:** [Framer Motion](https://www.framer.com/motion/) (UI interactions, staggering, scroll reveals)
*   **Animations 2:** [GSAP](https://gsap.com/) (Complex timeline orchestration, Boot Sequence)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Emails:** [Resend](https://resend.com/)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

*   Node.js (v18.17 or higher recommended)
*   npm, pnpm, or yarn

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/Vansh13199/Portfolio-Web.git
    cd Portfolio-Web
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env.local` file in the root directory and add your Resend API key for the contact form to work:
    ```env
    RESEND_API_KEY=your_resend_api_key_here
    ```

4.  **Run the development server**
    ```sh
    npm run dev
    ```

5.  **Open the application**
    Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

---

## 📂 Project Structure

A quick look at the core project organization:

```text
src/
├── app/
│   ├── api/          # Next.js Route Handlers (e.g., /api/contact for Resend)
│   ├── globals.css   # Global styles, Tailwind directives, custom CSS variables/animations
│   ├── layout.tsx    # Root layout configuration
│   └── page.tsx      # Main landing page orchestrating all components
├── components/       # Reusable React components
│   ├── BootSequence.tsx           # Initial GSAP terminal loading animation
│   ├── CloudVisualization.tsx     # Animated cloud nodes
│   ├── InteractiveKubernetesCluster.tsx # K8s pods visualization
│   ├── DevOpsPipeline.tsx         # Animated CI/CD workflow
│   ├── ContactTerminal.tsx        # CLI-style contact form
│   └── ...
├── hooks/            # Custom React Hooks
└── lib/              # Utility functions and shared library code
```

---

## 💡 Customization & Theming

The deep dark theme and neon accents are controlled via CSS variables in `src/app/globals.css`. You can easily adjust the primary colors:

```css
:root {
  --neon-cyan: #00f0ff;
  --neon-purple: #a855f7;
  --dark-bg: #050508;
}
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with 💻 and ☕ by <strong>Vansh</strong></p>
</div>
