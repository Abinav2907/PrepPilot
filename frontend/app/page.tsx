"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background Glow Effects */}
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[150px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[150px]" />

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              ✦ PrepPilot
            </span>
          </motion.div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="
    px-5
    py-2.5
    rounded-xl
    text-gray-300
    hover:text-white
    hover:bg-white/5
    transition-all
    duration-300
    font-medium
  "
            >
              Login
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2 font-semibold"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center px-6 pt-20">
        <div className="mx-auto max-w-6xl text-center">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 text-6xl font-black leading-tight md:text-8xl"
          >
            Master
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Technical Interviews
            </span>
            <br />
            With AI Coaching
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mb-10 max-w-3xl text-xl text-gray-400"
          >
            Upload your resume, get personalized mock interviews, receive
            AI-driven feedback, and track your growth until you&apos;re interview
            ready.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => router.push("/signup")}
              className="
    group
    relative
    overflow-hidden
    rounded-2xl
    bg-gradient-to-r
    from-purple-600
    via-violet-500
    to-cyan-500
    px-10
    py-5
    text-lg
    font-bold
    text-white
    shadow-[0_0_40px_rgba(139,92,246,0.35)]
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-[0_0_60px_rgba(34,211,238,0.4)]
  "
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Free
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>

              <div
                className="
      absolute
      inset-0
      bg-white/10
      opacity-0
      group-hover:opacity-100
      transition-opacity
      duration-300
    "
              />
            </button>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-32 grid gap-6 md:grid-cols-3"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-4xl font-bold text-purple-400">10K+</h3>

              <p className="mt-2 text-gray-400">Mock Interviews</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-4xl font-bold text-cyan-400">95%</h3>

              <p className="mt-2 text-gray-400">Success Rate</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-4xl font-bold text-purple-400">AI</h3>

              <p className="mt-2 text-gray-400">Personalized Coaching</p>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Features Section */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-5xl font-bold">
              Why Choose
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                PrepPilot?
              </span>
            </h2>

            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Everything you need to dominate technical interviews.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-3 hover:border-purple-500/40">
              <div className="mb-6 text-5xl">📄</div>

              <h3 className="mb-4 text-2xl font-bold">Resume Intelligence</h3>

              <p className="text-gray-400">
                AI extracts skills, projects, strengths, weaknesses and
                generates personalized insights.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-3 hover:border-cyan-500/40">
              <div className="mb-6 text-5xl">🎤</div>

              <h3 className="mb-4 text-2xl font-bold">AI Mock Interviews</h3>

              <p className="text-gray-400">
                Dynamic interview questions based on your profile and target
                role.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-3 hover:border-purple-500/40">
              <div className="mb-6 text-5xl">📈</div>

              <h3 className="mb-4 text-2xl font-bold">Growth Tracking</h3>

              <p className="text-gray-400">
                Monitor progress, identify weak areas and improve continuously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-5xl font-bold">Experience The Future</h2>

            <p className="text-lg text-gray-400">
              AI-powered insights at your fingertips.
            </p>
          </div>

          <div className="relative rounded-[40px] border border-white/10 bg-[#111827]/70 p-10 backdrop-blur-2xl shadow-[0_0_80px_rgba(139,92,246,0.15)]">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-purple-500/5 to-cyan-500/5" />

            <div className="relative">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold">Welcome Back 👋</h3>

                  <p className="text-gray-400">
                    Your interview preparation dashboard
                  </p>
                </div>

                <button
                  onClick={() => router.push("/login")}
                  className="
    rounded-2xl
    bg-gradient-to-r
    from-purple-600
    to-cyan-500
    px-6
    py-3
    font-semibold
    text-white
    shadow-lg
    shadow-purple-500/20
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-cyan-500/20
  "
                >
                  Start Interview
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-gray-400">Readiness Score</p>

                  <h3 className="mt-3 text-5xl font-bold text-purple-400">
                    87%
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-gray-400">Interviews</p>

                  <h3 className="mt-3 text-5xl font-bold text-cyan-400">24</h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-gray-400">Avg Score</p>

                  <h3 className="mt-3 text-5xl font-bold text-purple-400">
                    8.9
                  </h3>
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h4 className="mb-4 text-xl font-semibold">Top Skills</h4>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>React</span>
                      <span className="text-cyan-400">9/10</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Node.js</span>
                      <span className="text-cyan-400">8/10</span>
                    </div>

                    <div className="flex justify-between">
                      <span>PostgreSQL</span>
                      <span className="text-cyan-400">8/10</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h4 className="mb-4 text-xl font-semibold">Focus Areas</h4>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>System Design</span>
                      <span className="text-yellow-400">5/10</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Authentication</span>
                      <span className="text-yellow-400">6/10</span>
                    </div>

                    <div className="flex justify-between">
                      <span>SQL Optimization</span>
                      <span className="text-yellow-400">5/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="text-5xl font-bold">How It Works</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-5">
            {[
              "Upload Resume",
              "AI Analysis",
              "Mock Interview",
              "AI Feedback",
              "Get Hired",
            ].map((step, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
              >
                <div className="mb-4 text-4xl font-bold text-purple-400">
                  {index + 1}
                </div>

                <p className="font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-5xl font-bold">
              Trusted By Future Professionals
            </h2>

            <p className="text-lg text-gray-400">
              Hear what our users have to say.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <p className="mb-6 text-gray-300">
                &quot;PrepPilot completely changed how I prepare for interviews. The
                personalized questions felt incredibly realistic.&quot;
              </p>

              <h4 className="font-bold">Rahul K.</h4>
              <p className="text-sm text-gray-500">Frontend Developer</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <p className="mb-6 text-gray-300">
                &quot;The AI feedback highlighted weaknesses I didn&apos;t even know I
                had.&quot;
              </p>

              <h4 className="font-bold">Priya S.</h4>
              <p className="text-sm text-gray-500">Software Engineer</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <p className="mb-6 text-gray-300">
                &quot;The roadmap feature helped me focus on exactly what I needed.&quot;
              </p>

              <h4 className="font-bold">Arjun M.</h4>
              <p className="text-sm text-gray-500">Full Stack Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-purple-900/30 via-[#111827] to-cyan-900/30 p-16 text-center">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-purple-500/20 blur-[100px]" />
            <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-[100px]" />

            <div className="relative">
              <h2 className="mb-6 text-6xl font-black">
                Ready To Become
                <br />
                Interview Ready?
              </h2>

              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
                Join thousands of students and professionals preparing smarter
                with AI-powered coaching.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => router.push("/signup")}
                  className="
    group
    relative
    overflow-hidden
    rounded-2xl
    bg-gradient-to-r
    from-purple-600
    via-violet-500
    to-cyan-500
    px-10
    py-5
    text-lg
    font-bold
    text-white
    shadow-[0_0_40px_rgba(139,92,246,0.35)]
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-[0_0_60px_rgba(34,211,238,0.4)]
  "
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started Free
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>

                  <div
                    className="
      absolute
      inset-0
      bg-white/10
      opacity-0
      group-hover:opacity-100
      transition-opacity
      duration-300
    "
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h3 className="mb-2 text-3xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  ✦ PrepPilot
                </span>
              </h3>

              <p className="text-gray-400">
                AI-Powered Interview Preparation Platform
              </p>
            </div>

            <div className="flex gap-8 text-gray-400">
              <a href="#" className="hover:text-white">
                Features
              </a>

              <a href="#" className="hover:text-white">
                Dashboard
              </a>

              <a href="#" className="hover:text-white">
                Pricing
              </a>

              <a href="#" className="hover:text-white">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            © 2026 PrepPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
