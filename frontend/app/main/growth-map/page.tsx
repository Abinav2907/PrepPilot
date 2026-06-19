"use client";

import { TrendingUp, FileText, Mic, Target, Award } from "lucide-react";

export default function GrowthTrackerPage() {
  const skills = [
    { name: "React", progress: 90 },
    { name: "JavaScript", progress: 85 },
    { name: "TypeScript", progress: 80 },
    { name: "Node.js", progress: 60 },
    { name: "Docker", progress: 35 },
  ];

  const insights = [
    "Your resume score improved by 12% this month.",
    "Interview performance increased significantly.",
    "Frontend skills are your strongest area.",
    "Learning Docker can boost your profile further.",
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-black text-white md:text-5xl">
              Growth Tracker 📈
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Track your progress, monitor improvements, and stay on course
              toward your dream job.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
            <p className="text-sm text-gray-400">Overall Growth Score</p>

            <h2 className="mt-2 text-5xl font-black text-cyan-400">78%</h2>

            <p className="mt-1 text-sm text-cyan-300">+12% this month</p>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Resume Progress",
            value: "88%",
            icon: FileText,
            color: "text-purple-400",
          },
          {
            title: "Interview Progress",
            value: "84%",
            icon: Mic,
            color: "text-cyan-400",
          },
          {
            title: "Roadmap Progress",
            value: "67%",
            icon: Target,
            color: "text-green-400",
          },
          {
            title: "Skill Growth",
            value: "72%",
            icon: TrendingUp,
            color: "text-orange-400",
          },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">{card.title}</p>

                  <h2 className={`mt-3 text-4xl font-black ${card.color}`}>
                    {card.value}
                  </h2>
                </div>

                <Icon size={40} className={card.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Skill Progress */}
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-bold text-white">Skill Progress</h2>

          <div className="mt-8 space-y-6">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="mb-2 flex justify-between">
                  <span className="text-gray-300">{skill.name}</span>

                  <span className="text-gray-400">{skill.progress}%</span>
                </div>

                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                    style={{
                      width: `${skill.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-bold text-white">Achievement</h2>

          <div className="mt-8 text-center">
            <Award size={70} className="mx-auto text-yellow-400" />

            <h3 className="mt-5 text-xl font-bold text-white">
              Consistency Champion
            </h3>

            <p className="mt-2 text-gray-400">
              Maintained learning streak for 14 consecutive days.
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Weekly Activity</h2>

        <div className="mt-8 grid grid-cols-5 gap-4">
          {[
            { day: "Mon", value: 40 },
            { day: "Tue", value: 75 },
            { day: "Wed", value: 35 },
            { day: "Thu", value: 60 },
            { day: "Fri", value: 90 },
          ].map((item) => (
            <div key={item.day}>
              <div className="h-40 flex items-end">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-purple-500 to-cyan-500"
                  style={{
                    height: `${item.value}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-center text-gray-400">{item.day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">AI Growth Insights</h2>

        <div className="mt-6 space-y-4">
          {insights.map((item) => (
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
    </div>
  );
}
