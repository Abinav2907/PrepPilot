"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Code, Database, Globe, Coffee, Play } from "lucide-react";

export default function InterviewPage() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("Frontend");

  const [difficulty, setDifficulty] = useState("Intermediate");

  const [jobRole, setJobRole] = useState("");

  const categories = [
    {
      name: "Frontend",
      icon: Globe,
    },
    {
      name: "Backend",
      icon: Database,
    },
    {
      name: "Full Stack",
      icon: Code,
    },
    {
      name: "Java",
      icon: Coffee,
    },
    {
      name: "Python",
      icon: Brain,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-black text-white md:text-5xl">
              AI Mock Interview
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Practice technical interviews with AI and receive instant feedback
              on your answers, communication skills and technical knowledge.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
            <p className="text-sm text-gray-400">Interview Readiness</p>

            <h3 className="mt-2 text-3xl font-black text-cyan-400">78%</h3>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Choose Interview Type</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`rounded-2xl border p-5 transition-all ${
                  selectedCategory === category.name
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <Icon size={32} className="mx-auto text-cyan-400" />

                <p className="mt-3 text-center font-semibold text-white">
                  {category.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Difficulty Level</h2>

        <div className="mt-6 flex flex-wrap gap-4">
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`rounded-full px-6 py-3 font-semibold transition ${
                difficulty === level
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
                  : "border border-white/10 bg-white/[0.03] text-gray-300"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Setup */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Interview Setup</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-gray-300">Job Role</label>

            <input
              type="text"
              placeholder="Frontend Developer"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-4
                text-white
                outline-none
              "
            />
          </div>

          <div>
            <label htmlFor="experience" className="mb-2 block text-gray-300">
              Experience
            </label>

            <select
              id="experience"
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-4
                text-white
                outline-none
              "
            >
              <option>Fresher</option>
              <option>1-2 Years</option>
              <option>3-5 Years</option>
              <option>5+ Years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Skills Covered</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          {[
            "React",
            "TypeScript",
            "JavaScript",
            "Node.js",
            "MongoDB",
            "Docker",
            "AWS",
          ].map((skill) => (
            <div
              key={skill}
              className="
                rounded-full
                border
                border-cyan-500/20
                bg-cyan-500/10
                px-5
                py-2
                text-cyan-300
              "
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Start Interview */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <h2 className="text-3xl font-black text-white">Ready to Start?</h2>

        <p className="mt-3 text-gray-400">
          AI will generate questions based on your selected role and difficulty
          level.
        </p>

        <button
          onClick={() => router.push("/main/interview-analysis")}
          className="
            mt-8
            inline-flex
            items-center
            gap-3
            rounded-2xl
            bg-gradient-to-r
            from-purple-600
            to-cyan-500
            px-8
            py-4
            font-semibold
            text-white
            transition
            hover:scale-[1.02]
          "
        >
          <Play size={20} />
          Start AI Interview
        </button>
      </div>
    </div>
  );
}
