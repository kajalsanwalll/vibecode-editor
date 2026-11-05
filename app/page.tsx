
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Files,
  Github,
  Play,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import LogoutButton from "@/components/logout-button";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Coding",
    description:
      "Get intelligent code suggestions, explanations, and refactoring assistance with local LLMs.",
  },
  {
    icon: Play,
    title: "Instant Execution",
    description:
      "Run frontend and backend projects directly in your browser with WebContainers.",
  },
  {
    icon: Code2,
    title: "Powerful Code Editor",
    description:
      "Enjoy Monaco Editor with syntax highlighting, formatting, and a seamless coding experience.",
  },
  {
    icon: Terminal,
    title: "Built-in Terminal",
    description:
      "Manage files, execute commands, and control your development workflow in one place.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] text-[#202020]">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white">
              <Code2 size={21} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              VibeCode<span className="text-red-500">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-gray-500 md:flex">
            <Link href="/" className="transition hover:text-red-500">
              Home
            </Link>
            <Link href="#features" className="transition hover:text-red-500">
              Features
            </Link>
            <Link href="#about" className="transition hover:text-red-500">
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
  <Button
    asChild
    className="bg-red-500 text-white shadow-sm hover:bg-red-600"
  >
    <Link href="/dashboard">
      Dashboard
      <ArrowRight size={16} className="ml-2" />
    </Link>
  </Button>

  <LogoutButton />
</div>

        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pb-16 pt-24 md:pb-24 md:pt-32">

        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[400px] w-[650px] -translate-x-1/2 rounded-full bg-red-100/60 blur-[120px]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">

          <div className="mb-8 flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600">
            <Sparkles size={14} />
            YOUR AI-POWERED WEB IDE
          </div>

          <h1 className="text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl md:text-7xl">
            Think it. Code it.
            <span className="mt-2 block text-red-500">
              Run it. All in one place.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-gray-500 md:text-lg">
            A powerful browser-based development environment with an
            AI coding assistant, real-time execution, and everything
            you need to bring your ideas to life.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            <Button
              asChild
              size="lg"
              className="h-12 bg-red-500 px-7 text-base text-white shadow-md shadow-red-200 hover:bg-red-600"
            >
              <Link href="/dashboard">
                Start Building
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-gray-200 bg-white px-7 text-base hover:bg-gray-50"
            >
              <Link href="#features">
                Explore Features
              </Link>
            </Button>

          </div>

        </div>
      </section>

      {/* IDE Preview */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.10)]">

            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#f7f7f7] px-5 py-4">

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <span className="text-xs font-medium text-gray-500">
                VibeCode Editor
              </span>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Github size={15} />
                <span className="hidden sm:inline">Workspace</span>
              </div>

            </div>

            {/* Editor */}
            <div className="grid min-h-[340px] grid-cols-[130px_1fr] bg-[#17191f] text-gray-300 sm:grid-cols-[190px_1fr]">

              {/* File Explorer */}
              <div className="border-r border-white/10 p-4">

                <div className="mb-5 text-[10px] font-semibold tracking-widest text-gray-500">
                  EXPLORER
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Files size={14} className="text-red-400" />
                    project
                  </div>

                  <div className="space-y-3 pl-3">
                    <div className="text-gray-400">src</div>
                    <div className="flex items-center gap-2 text-red-300">
                      <Code2 size={13} />
                      page.tsx
                    </div>
                    <div className="text-gray-400">layout.tsx</div>
                    <div className="text-gray-400">globals.css</div>
                  </div>

                  <div className="text-gray-400">package.json</div>
                  <div className="text-gray-400">README.md</div>
                </div>

              </div>

              {/* Code Area */}
              <div className="min-w-0 p-5 sm:p-7">

                <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs text-red-300">
                    page.tsx
                  </span>
                  <span className="text-[10px] text-gray-500">
                    TypeScript React
                  </span>
                </div>

                <div className="space-y-3 overflow-hidden font-mono text-xs sm:text-sm">

                  <p>
                    <span className="text-pink-400">import</span>
                    <span className="text-gray-300"> React </span>
                    <span className="text-pink-400">from</span>
                    <span className="text-green-300"> &quot;react&quot;</span>
                  </p>

                  <p>
                    <span className="text-pink-400">export default function</span>
                    <span className="text-yellow-200"> Home</span>
                    <span className="text-gray-300">() {"{"}</span>
                  </p>

                  <p className="pl-5">
                    <span className="text-pink-400">return</span>
                    <span className="text-gray-300"> (</span>
                  </p>

                  <p className="pl-10">
                    <span className="text-gray-300">{"<"}main </span>
                    <span className="text-sky-300">className</span>
                    <span className="text-gray-300">=</span>
                    <span className="text-green-300">&quot;min-h-screen&quot;</span>
                    <span className="text-gray-300">{">"}</span>
                  </p>

                  <p className="pl-14 text-gray-400">
                    {"{/* Your next big idea starts here */}"}
                  </p>

                  <p className="pl-14">
                    <span className="text-gray-300">{"<"}h1{">"}</span>
                    <span className="text-green-300">
                      Hello, World!
                    </span>
                    <span className="text-gray-300">{"</"}h1{">"}</span>
                  </p>

                  <p className="pl-10 text-gray-300">{"</"}main{">"}</p>

                  <p className="pl-5 text-gray-300">);</p>
                  <p className="text-gray-300">{"}"}</p>

                </div>

                <div className="mt-9 flex items-center gap-2 border-t border-white/10 pt-5 text-[10px] text-gray-500">
                  <Terminal size={13} />
                  Ready to build something amazing?
                </div>

              </div>
            </div>

          </div>

          <p className="mt-5 text-center text-xs text-gray-400">
            Your development environment. Right in your browser.
          </p>

        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-200 bg-white px-6 py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mb-14 text-center">
            <span className="text-xs font-semibold tracking-widest text-red-500">
              BUILT FOR DEVELOPERS
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to build.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
              From your first line of code to a running application,
              VibeCode brings your entire development workflow together.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-200 bg-[#fafafa] p-7 transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 transition group-hover:bg-red-500 group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <h3 className="font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#fff1f1] px-7 py-16 text-center md:px-16">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white">
            <Zap size={27} />
          </div>

          <h2 className="mt-7 text-3xl font-bold tracking-tight md:text-4xl">
            Your next big idea starts here.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
            Stop switching between tools. Open your workspace,
            explore your ideas and start building.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-9 bg-red-500 px-8 text-white hover:bg-red-600"
          >
            <Link href="/dashboard">
              Get Started
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">

          <Link href="/" className="font-bold text-gray-800">
            VibeCode<span className="text-red-500">.</span>
          </Link>

          <p>
            Built for developers who love to create. © 2026 VibeCode.
          </p>

          <a
            href="https://github.com/kajalsanwalll/vibecode-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition hover:text-red-500"
          >
            <Github size={17} />
            GitHub
          </a>

        </div>
      </footer>

    </main>
  );
}
