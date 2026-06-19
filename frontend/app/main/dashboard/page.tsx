"use client";

import { FileText, Target, Briefcase, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const stats = [
    {
      title: "Resume Score",
      value: "88",
      icon: FileText,
      color: "from-purple-600/20 to-purple-500/5",
      text: "text-purple-400",
    },
    {
      title: "ATS Score",
      value: "82",
      icon: Target,
      color: "from-cyan-600/20 to-cyan-500/5",
      text: "text-cyan-400",
    },
    {
      title: "Interviews",
      value: "12",
      icon: Briefcase,
      color: "from-green-600/20 to-green-500/5",
      text: "text-green-400",
    },
    {
      title: "Roadmap",
      value: "67%",
      icon: TrendingUp,
      color: "from-orange-600/20 to-orange-500/5",
      text: "text-orange-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-black text-white md:text-5xl">
              Welcome Back 👋
            </h2>

            <p className="mt-3 max-w-2xl text-gray-400">
              Track your resume quality, interview readiness and career growth
              all in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 p-6">
            <p className="text-sm text-gray-400">Current Level</p>

            <h3 className="mt-2 text-3xl font-black text-white">
              Career Explorer
            </h3>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className={`
                rounded-3xl
                border
                border-white/10
                bg-gradient-to-br
                ${stat.color}
                p-6
                backdrop-blur-xl
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>

                  <h2 className={`mt-3 text-5xl font-black ${stat.text}`}>
                    {stat.value}
                  </h2>
                </div>

                <Icon size={42} className={stat.text} />
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 xl:col-span-2">
          {/* RECENT ACTIVITY */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>

            <div className="mt-6 space-y-4">
              {[
                "Resume uploaded successfully",
                "ATS score improved by 5%",
                "Completed React interview",
                "Updated roadmap progress",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI INSIGHTS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-bold text-white">
              AI Career Insights
            </h2>

            <div className="mt-6 space-y-4">
              {[
                "Resume score is stronger than 82% of freshers",
                "Adding Docker can improve ATS score",
                "Deploying a full-stack project is recommended",
                "Practice backend interview questions",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-cyan-300"
                >
                  💡 {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* QUICK ACTIONS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>

            <div className="mt-6 space-y-4">
              <button
                onClick={() => router.push("/main/resume-upload")}
                className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 p-4 font-semibold text-white"
              >
                Upload Resume
              </button>

              <button
                onClick={() => router.push("/main/interview")}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 font-semibold text-white"
              >
                Start Interview
              </button>

              <button
                onClick={() => router.push("/main/roadmap")}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 font-semibold text-white"
              >
                View Roadmap
              </button>
            </div>
          </div>

          {/* LAST RESUME */}
          <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">
            <p className="text-gray-400">Last Uploaded Resume</p>

            <h3 className="mt-3 text-xl font-bold text-white">
              Abinav_Resume.pdf
            </h3>

            <p className="mt-2 text-purple-300">Uploaded Today</p>
          </div>
        </div>
      </div>

      {/* GOALS */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Career Goals</h2>

        <div className="mt-6 space-y-6">
          {[
            {
              label: "Resume Optimization",
              value: 88,
            },
            {
              label: "Interview Preparation",
              value: 60,
            },
            {
              label: "Roadmap Completion",
              value: 67,
            },
          ].map((goal) => (
            <div key={goal.label}>
              <div className="mb-2 flex justify-between">
                <span className="text-gray-300">{goal.label}</span>

                <span className="text-gray-400">{goal.value}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  style={{
                    width: `${goal.value}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPCOMING GOALS */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Upcoming Goals</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "Complete ATS Optimization",
            "Learn Docker Basics",
            "Finish Mock Interview",
          ].map((goal) => (
            <div
              key={goal}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="font-semibold text-white">{goal}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
