"use client";

import { CheckCircle, Circle, PlayCircle, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { roadmaps } from "./roadmaps";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<any[]>([]);

  const completedCount = roadmap.filter(
    (item) => item.status === "completed",
  ).length;

  const progress =
    roadmap.length === 0
      ? 0
      : Math.round((completedCount / roadmap.length) * 100);

  useEffect(() => {
    const resume = JSON.parse(localStorage.getItem("resumeResult") || "{}");

    // Change this later if you let users choose a role
    const selectedRole = "Frontend";

    const baseRoadmap = roadmaps[selectedRole as keyof typeof roadmaps] || [];

    const missingSkills = resume.missing_skill_list || [];

    const completedSkills = ["HTML", "CSS", "JavaScript", "React"];

    let currentFound = false;

    const roadmapData = baseRoadmap.map((skill) => {
      if (completedSkills.includes(skill)) {
        return {
          title: skill,
          status: "completed",
          description: `Learn ${skill} to improve your profile.`,
        };
      }

      if (!currentFound) {
        currentFound = true;

        return {
          title: skill,
          status: "current",
          description: `Learn ${skill} to improve your profile.`,
        };
      }

      return {
        title: skill,
        status: "upcoming",
        description: `Learn ${skill} to improve your profile.`,
      };
    });

    setRoadmap(roadmapData);
    const completed = roadmapData.filter(
      (item) => item.status === "completed",
    ).length;

    const progress = Math.round((completed / roadmapData.length) * 100);

    setRoadmap(roadmapData);

    localStorage.setItem("roadmap", JSON.stringify({ progress }));
  }, []);
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-black text-white md:text-5xl">
              Learning Roadmap 🚀
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Track your journey from beginner to software engineer with a
              structured roadmap.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
            <p className="text-sm text-gray-400">Roadmap Progress</p>

            <h2 className="mt-2 text-5xl font-black text-cyan-400">
              {progress}%
            </h2>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Overall Progress</h2>

          <span className="text-cyan-400 font-semibold">
            {progress}% Complete
          </span>
        </div>

        <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Goal */}
      <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">
        <div className="flex items-center gap-4">
          <Target className="text-purple-400" size={32} />

          <div>
            <h2 className="text-xl font-bold text-white">Current Focus</h2>

            <p className="mt-1 text-purple-300">
              {roadmap.find((item) => item.status === "current")?.title ||
                "Complete your roadmap."}
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Career Roadmap</h2>

        <div className="mt-8 space-y-6">
          {roadmap.map((item, index) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                {item.status === "completed" ? (
                  <CheckCircle size={28} className="text-green-400" />
                ) : item.status === "current" ? (
                  <PlayCircle size={28} className="text-cyan-400" />
                ) : (
                  <Circle size={28} className="text-gray-500" />
                )}

                {index !== roadmap.length - 1 && (
                  <div className="mt-2 h-12 w-[2px] bg-white/10" />
                )}
              </div>

              <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm ${
                      item.status === "completed"
                        ? "bg-green-500/10 text-green-400"
                        : item.status === "current"
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="mt-3 text-gray-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 space-y-4">
        {roadmap
          .filter((item) => item.status === "upcoming")
          .slice(0, 4)
          .map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-cyan-300"
            >
              💡 Learn <strong>{item.title}</strong> to improve your resume and
              career readiness.
            </div>
          ))}
      </div>
    </div>
  );
}
