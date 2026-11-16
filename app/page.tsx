
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Files,
  Github,
  Terminal,
} from "lucide-react";

import LogoutButton from "@/components/logout-button";
import { Button } from "@/components/ui/button";

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
      <section className="relative px-6 pb-14 pt-20 md:pb-20 md:pt-28">

        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[400px] w-[650px] -translate-x-1/2 rounded-full bg-red-100/60 blur-[120px]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">

          <div className="mb-7 flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600">
            <Code2 size={14} />
            YOUR AI-POWERED WEB IDE
          </div>

          <h1 className="text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl md:text-7xl">
            Your code editor just a tab away!
            <span className="mt-2 text-6xl block text-red-500">
              switch tabs, start building
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-gray-500 md:text-lg">
            A powerful browser-based development environment with an

            AI coding assistant, real-time execution, and everything

            you need to bring your ideas to life.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-9 h-12 bg-red-500 px-8 text-base text-white shadow-md shadow-red-200 hover:bg-red-600"
          >
            <Link href="/dashboard">
              Start Building
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>

        </div>
      </section>

      {/* IDE Preview */}
      <section className="px-5 pb-20 md:px-6">
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
            <div className="grid min-h-[300px] grid-cols-[110px_1fr] bg-[#17191f] text-gray-300 sm:grid-cols-[190px_1fr]">

              {/* File Explorer */}
              <div className="border-r border-white/10 p-3 sm:p-4">

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

                    <div className="hidden text-gray-400 sm:block">
                      layout.tsx
                    </div>
                    <div className="hidden text-gray-400 sm:block">
                      globals.css
                    </div>
                  </div>

                  <div className="text-gray-400">package.json</div>
                  <div className="hidden text-gray-400 sm:block">
                    README.md
                  </div>

                </div>
              </div>

              {/* Code Area */}
              <div className="min-w-0 p-4 sm:p-7">

                <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs text-red-300">
                    page.tsx
                  </span>
                  <span className="text-[10px] text-gray-500">
                    TypeScript React
                  </span>
                </div>

                <div className="space-y-3 overflow-hidden font-mono text-[10px] sm:text-sm">

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

                  <p className="pl-10 text-gray-300">
                    {"</"}main{">"}
                  </p>

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
            Your development environment. Just one tab away.
          </p>

        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-gray-400 sm:flex-row">

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
            <Github size={16} />
            GitHub
          </a>

        </div>
      </footer>

    </main>
  );
}