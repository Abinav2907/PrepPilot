"use client";

import { useRouter } from "next/navigation";

export default function ResumeAnalysisPage() {
  const router = useRouter();

  const strengths = [
    "Strong React Knowledge",
    "TypeScript Experience",
    "Responsive Design Skills",
    "Good Project Portfolio",
  ];

  const weaknesses = [
    "Missing Docker Skills",
    "Missing AWS Skills",
    "Limited Backend Projects",
    "No Internship Experience",
  ];

  const missingSkills = [
    "Docker",
    "AWS",
    "Kubernetes",
    "CI/CD",
    "System Design",
    "MongoDB",
  ];

  const suggestions = [
    "Add measurable achievements",
    "Include GitHub repository links",
    "Learn Docker and Containerization",
    "Build a full-stack production project",
    "Add deployment experience",
  ];

  return (
    <div className="space-y-8">
      {/* ACTION BAR */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Resume Performance Overview
          </h2>

          <p className="mt-1 text-gray-400">
            Latest AI analysis of your uploaded resume.
          </p>
        </div>

        <button
          onClick={() => router.push("/resume-upload")}
          className="
            rounded-2xl
            bg-gradient-to-r
            from-purple-600
            to-cyan-500
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:scale-[1.02]
          "
        >
          Upload New Resume
        </button>
      </div>

      {/* SCORE CARDS */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">
          <p className="text-gray-400">Resume Score</p>

          <h3 className="mt-3 text-5xl font-black text-purple-400">88</h3>

          <p className="mt-2 text-sm text-gray-500">Overall Resume Quality</p>
        </div>

        <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
          <p className="text-gray-400">ATS Score</p>

          <h3 className="mt-3 text-5xl font-black text-cyan-400">82</h3>

          <p className="mt-2 text-sm text-gray-500">ATS Compatibility</p>
        </div>

        <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-6">
          <p className="text-gray-400">Matched Skills</p>

          <h3 className="mt-3 text-5xl font-black text-green-400">14</h3>

          <p className="mt-2 text-sm text-gray-500">Skills Identified</p>
        </div>

        <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <p className="text-gray-400">Missing Skills</p>

          <h3 className="mt-3 text-5xl font-black text-orange-400">6</h3>

          <p className="mt-2 text-sm text-gray-500">Recommended Skills</p>
        </div>
      </div>

      {/* ATS CHECKLIST */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h3 className="text-2xl font-bold text-white">
          ATS Optimization Checklist
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-green-500/10 p-4 text-green-400">
            ✓ Contact Information Present
          </div>

          <div className="rounded-xl bg-green-500/10 p-4 text-green-400">
            ✓ Skills Section Included
          </div>

          <div className="rounded-xl bg-yellow-500/10 p-4 text-yellow-400">
            ⚠ Add More Keywords
          </div>

          <div className="rounded-xl bg-red-500/10 p-4 text-red-400">
            ✕ Missing Certifications
          </div>
        </div>
      </div>

      {/* STRENGTHS + WEAKNESSES */}

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <h3 className="text-2xl font-bold">Strengths</h3>

          <div className="mt-6 space-y-3">
            {strengths.map((item) => (
              <div
                key={item}
                className="
                  rounded-xl
                  border
                  border-green-500/20
                  bg-green-500/10
                  p-4
                  text-green-400
                "
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <h3 className="text-2xl font-bold">Improvement Areas</h3>

          <div className="mt-6 space-y-3">
            {weaknesses.map((item) => (
              <div
                key={item}
                className="
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  p-4
                  text-red-400
                "
              >
                ✕ {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MISSING SKILLS */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h3 className="text-2xl font-bold">Recommended Skills</h3>

        <div className="mt-6 flex flex-wrap gap-3">
          {missingSkills.map((skill) => (
            <span
              key={skill}
              className="
                rounded-full
                border
                border-purple-500/20
                bg-purple-500/10
                px-4
                py-2
                text-sm
                text-purple-300
              "
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* AI SUGGESTIONS */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h3 className="text-2xl font-bold">AI Recommendations</h3>

        <div className="mt-6 space-y-4">
          {suggestions.map((item) => (
            <div
              key={item}
              className="
                rounded-2xl
                border
                border-cyan-500/20
                bg-cyan-500/10
                p-4
                text-cyan-300
              "
            >
              💡 {item}
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}

      <div className="grid gap-4 md:grid-cols-2">
        <button
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            p-4
            font-semibold
            hover:bg-white/10
          "
        >
          Download Report
        </button>

        <button
          onClick={() => router.push("/main/dashboard")}
          className="
            rounded-2xl
            bg-gradient-to-r
            from-purple-600
            to-cyan-500
            p-4
            font-semibold
            text-white
          "
        >
          Back To Dashboard
        </button>
      </div>
    </div>
  );
}
