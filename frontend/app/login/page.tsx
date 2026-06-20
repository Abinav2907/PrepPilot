"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/onboarding",
      },
    });

    console.log(data);
    console.log(error);

    if (error) {
      alert(error.message);
    }
  };
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/onboarding");
  };
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background Glow */}
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[150px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[150px]" />

      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-8 xl:px-16">
        <h1 className="mb-6 text-4xl md:text-5xl xl:text-7xl font-black leading-tight">
          Welcome To
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            PrepPilot
          </span>
        </h1>

        <p className="max-w-xl text-base md:text-lg xl:text-xl text-gray-400">
          Master technical interviews with AI-powered coaching, resume analysis,
          personalized mock interviews and detailed feedback.
        </p>

        <div className="mt-12 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-4xl font-bold text-purple-400">10K+</h3>

            <p className="mt-2 text-gray-400">Interviews Conducted</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-4xl font-bold text-cyan-400">95%</h3>

            <p className="mt-2 text-gray-400">Success Rate</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-[24px] sm:rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 backdrop-blur-2xl">
          <h2 className="mb-2 text-3xl sm:text-4xl font-bold">Login</h2>

          <p className="mb-8 text-gray-400">Welcome back to PrepPilot</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm sm:text-base outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 pr-12 text-sm sm:text-base outline-none focus:border-purple-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 sm:py-4 text-sm sm:text-base font-semibold"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 font-medium hover:bg-white/10"
          >
            Continue With Google
          </button>

          <p className="mt-8 text-center text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-cyan-400">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
