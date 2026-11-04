
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Code2,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#09090b] text-white">

      {/* Background effects */}
      <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px]" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between border-b border-white/10 px-8 py-5 md:px-16">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
            <Code2 size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            VibeCode<span className="text-violet-400">.</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-zinc-400 sm:block">
            Your ideas. Your code. Your vibe.
          </span>
          <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">

        <div className="mb-8 flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
          <Sparkles size={15} />
          Build something extraordinary
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Turn your ideas into
          <span className="block bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            reality with code.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
          A creative space for developers to experiment, build, and bring
          their ideas to life. Write code, explore possibilities, and
          create without limits.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 bg-violet-600 px-7 text-base hover:bg-violet-500"
          >
            Get Started
            <ArrowRight className="ml-2" size={18} />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-12 border-white/15 bg-white/5 px-7 text-base text-white hover:bg-white/10"
          >
            <Terminal className="mr-2" size={18} />
            Explore Editor
          </Button>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-violet-400/40">
            <Code2 className="mb-4 text-violet-400" size={25} />
            <h3 className="font-semibold">Code Your Way</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              A flexible coding environment designed for your workflow.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-violet-400/40">
            <Sparkles className="mb-4 text-pink-400" size={25} />
            <h3 className="font-semibold">Create Freely</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Experiment with ideas and turn inspiration into projects.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-violet-400/40">
            <Zap className="mb-4 text-yellow-400" size={25} />
            <h3 className="font-semibold">Stay in Flow</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Keep your focus on building instead of fighting your tools.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 py-5 text-center text-sm text-zinc-600">
        Built for creators who love to code. © 2026 VibeCode.
      </footer>
    </main>
  );
}
