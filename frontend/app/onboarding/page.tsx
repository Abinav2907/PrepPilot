"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface OnboardingData {
  fullName: string;
  targetRole: string;
  experienceLevel: string;
  skills: string;
  careerGoal: string;
}

export default function OnboardingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<OnboardingData>({
    fullName: "",
    targetRole: "",
    experienceLevel: "",
    skills: "",
    careerGoal: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.targetRole ||
      !formData.experienceLevel
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not found");
        return;
      }

      const { error: insertError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: formData.fullName,
        degree: formData.experienceLevel,
        target_role: formData.targetRole,
      });

      if (insertError) {
        console.log(insertError);
        setError(insertError.message);
        return;
      }

      setSuccess("Profile completed successfully!");

      setTimeout(() => {
        router.push("/resume-upload");
      }, 1000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Glow Effects */}
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[150px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[150px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 backdrop-blur-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black sm:text-4xl">
              Complete Your Profile
            </h1>

            <p className="mt-3 text-gray-400">
              Help PrepPilot personalize your interview preparation.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="targetRole"
                className="mb-2 block text-sm text-gray-400"
              >
                Target Role *
              </label>

              <select
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none focus:border-purple-500"
              >
                <option value="">Select Role</option>

                <option>Frontend Developer</option>

                <option>Backend Developer</option>

                <option>Full Stack Developer</option>

                <option>Java Developer</option>

                <option>Python Developer</option>

                <option>Data Analyst</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="experienceLevel"
                className="mb-2 block text-sm text-gray-400"
              >
                Experience Level *
              </label>

              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none focus:border-purple-500"
              >
                <option value="">Select Experience</option>

                <option>Beginner</option>

                <option>Intermediate</option>

                <option>Advanced</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Skills</label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Java, SQL..."
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Career Goal
              </label>

              <textarea
                rows={4}
                name="careerGoal"
                value={formData.careerGoal}
                onChange={handleChange}
                placeholder="Describe your dream job or company..."
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-4 font-semibold transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
