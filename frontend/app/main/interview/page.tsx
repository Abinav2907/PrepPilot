"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Code, Database, Globe, Coffee, Play } from "lucide-react";

export default function InterviewPage() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("Frontend");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("Fresher");

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "React",
    "JavaScript",
  ]);

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

  const allSkills = [
    "React",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "Docker",
    "AWS",
    "Java",
    "Spring Boot",
    "Python",
    "Django",
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => prev.filter((s) => s !== skill));
    } else {
      setSelectedSkills((prev) => [...prev, skill]);
    }
  };

  const handleStartInterview = async () => {
    try {
      if (!jobRole.trim()) {
        alert("Please enter a Job Role.");
        return;
      }

      if (selectedSkills.length === 0) {
        alert("Select at least one skill.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/interview/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: selectedCategory,
            role: jobRole,
            difficulty,
            experience,
            skills: selectedSkills,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      localStorage.setItem(
        "interviewQuestions",
        JSON.stringify(data.questions),
      );

      localStorage.setItem(
        "interviewSetup",
        JSON.stringify({
          category: selectedCategory,
          role: jobRole,
          difficulty,
          experience,
          skills: selectedSkills,
        }),
      );

      router.push("/interview-session");
    } catch (err) {
      console.error(err);
      alert("Failed to generate interview.");
    }
  };

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
              Practice AI-powered mock interviews customized to your role,
              experience and skills.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
            <p className="text-sm text-gray-400">Ready For Interview</p>

            <h3 className="mt-2 text-3xl font-black text-cyan-400">
              AI Powered
            </h3>
          </div>
        </div>
      </div>

      {/* Categories */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">
          Choose Interview Category
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`rounded-2xl border p-5 transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "border-cyan-500 bg-cyan-500/10 scale-105"
                    : "border-white/10 bg-white/[0.03] hover:border-cyan-500/30"
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
                  : "border border-white/10 bg-white/[0.03] text-gray-300 hover:border-cyan-400"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Interview Setup */}

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
              className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-4 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-300">Experience</label>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-4 text-white outline-none focus:border-cyan-500"
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Select Skills</h2>

          <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            {selectedSkills.length} Selected
          </span>
        </div>

        <p className="mt-2 text-gray-400">
          Choose the technologies you want the AI interview to focus on.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          {allSkills.map((skill) => {
            const selected = selectedSkills.includes(skill);

            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`rounded-full px-5 py-3 font-medium transition-all duration-300 ${
                  selected
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg"
                    : "border border-white/10 bg-white/[0.03] text-gray-300 hover:border-cyan-400 hover:text-white"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Skills */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold text-white">Selected Skills</h2>

        {selectedSkills.length === 0 ? (
          <p className="mt-4 text-gray-400">No skills selected.</p>
        ) : (
          <div className="mt-5 flex flex-wrap gap-3">
            {selectedSkills.map((skill) => (
              <div
                key={skill}
                className="rounded-full bg-cyan-500/10 px-5 py-2 text-cyan-300"
              >
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Start Interview */}

      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-purple-600/10 to-cyan-500/10 p-8 text-center">
        <h2 className="text-3xl font-black text-white">Ready To Start?</h2>

        <p className="mt-3 text-gray-400">
          AI will generate interview questions based on your category,
          experience, difficulty level and selected skills.
        </p>

        <button
          onClick={handleStartInterview}
          className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-4 font-semibold text-white transition hover:scale-105"
        >
          <Play size={22} />
          Start AI Interview
        </button>
      </div>
    </div>
  );
}
