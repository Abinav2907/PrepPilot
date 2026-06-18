"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background Glow */}
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[150px]" />
      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[150px]" />

      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-8 xl:px-16">
        <h1 className="mb-6 text-4xl md:text-5xl xl:text-7xl font-black leading-tight">
          Start Your
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            PrepPilot Journey
          </span>
        </h1>

        <p className="max-w-xl text-base md:text-lg xl:text-xl text-gray-400">
          Create your account, upload your resume, practice AI-powered
          interviews, and track your growth.
        </p>

        <div className="mt-12 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-4xl font-bold text-purple-400">10K+</h3>

            <p className="mt-2 text-gray-400">Mock Interviews</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-4xl font-bold text-cyan-400">95%</h3>

            <p className="mt-2 text-gray-400">Success Rate</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 sm:px-6 md:px-8 py-10">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-[24px] sm:rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 backdrop-blur-2xl">
          <h2 className="mb-2 text-3xl sm:text-4xl font-bold">
            Create Account
          </h2>

          <p className="mb-8 text-gray-400">
            Join PrepPilot and start preparing smarter
          </p>

          <form className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Username
              </label>

              <input
                type="text"
                placeholder="Choose a username"
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm sm:text-base outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm sm:text-base outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm sm:text-base outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm sm:text-base outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 sm:py-4 text-sm sm:text-base font-semibold"
            >
              Create Account
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button className="w-full rounded-xl border border-white/10 bg-white/5 py-3 sm:py-4 text-sm sm:text-base font-medium hover:bg-white/10">
            Continue With Google
          </button>

          <p className="mt-8 text-center text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-cyan-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
