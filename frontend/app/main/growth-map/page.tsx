"use client";

import { TrendingUp, FileText, Mic, Target, Award } from "lucide-react";
import { useEffect, useState } from "react";

export default function GrowthTrackerPage() {
  const [growthScore, setGrowthScore] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [interviewScore, setInterviewScore] = useState(0);
  const [roadmapProgress, setRoadmapProgress] = useState(0);
  const [skillGrowth, setSkillGrowth] = useState(0);

  const [skills, setSkills] = useState<{ name: string; progress: number }[]>(
    [],
  );

  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    // -------------------------
    // Resume Result
    // -------------------------

    const resume = JSON.parse(localStorage.getItem("resumeResult") || "{}");

    console.log("Resume Result:", resume);
    // -------------------------
    // Interview Result
    // -------------------------

    const interview = JSON.parse(
      localStorage.getItem("interviewResult") || "{}",
    );

    // -------------------------
    // Roadmap (Future)
    // -------------------------

    const roadmap = JSON.parse(localStorage.getItem("roadmap") || "{}");

    // -------------------------
    // Resume Score
    // -------------------------

    setResumeScore(resume.resume_score ?? 0);

    // -------------------------
    // Interview Score
    // -------------------------

    setInterviewScore(interview.overallScore || 0);

    // -------------------------
    // Roadmap Progress
    // -------------------------

    setRoadmapProgress(roadmap.progress || 0);

    // -------------------------
    // Growth Score
    // -------------------------

    const overall = Math.round(
      ((resume.resume_score || 0) + (interview.overallScore || 0)) / 2,
    );

    setGrowthScore(overall);

    // -------------------------
    // Skill Growth
    // -------------------------

    const totalSkills =
      (resume.matched_skills || 0) + (resume.missing_skills || 0);

    const skillPercentage =
      totalSkills > 0
        ? Math.round((resume.matched_skills / totalSkills) * 100)
        : 0;

    setSkillGrowth(skillPercentage);

    // -------------------------
    // Skills
    // -------------------------

    const generatedSkills = [];

    if (resume.matched_skills > 0) {
      generatedSkills.push({
        name: "Skill Match",
        progress: skillPercentage,
      });
    }

    if (resume.ats_score) {
      generatedSkills.push({
        name: "ATS Compatibility",
        progress: resume.ats_score,
      });
    }

    if (interview.technical) {
      generatedSkills.push({
        name: "Technical Knowledge",
        progress: interview.technical,
      });
    }

    if (interview.communication) {
      generatedSkills.push({
        name: "Communication",
        progress: interview.communication,
      });
    }

    if (interview.confidence) {
      generatedSkills.push({
        name: "Confidence",
        progress: interview.confidence,
      });
    }

    setSkills(generatedSkills);

    // -------------------------
    // AI Insights
    // -------------------------

    const aiInsights = [];

    if (interview.feedback) {
      aiInsights.push(...interview.feedback);
    }

    if (resume.recommendations) {
      aiInsights.push(...resume.recommendations);
    }

    setInsights(aiInsights);
  }, []);

  let achievement = {
    title: "",
    description: "",
  };

  if (growthScore >= 90) {
    achievement = {
      title: "Elite Performer 🏆",
      description:
        "Outstanding resume and interview performance. You're ready for top software engineering roles.",
    };
  } else if (growthScore >= 80) {
    achievement = {
      title: "Consistency Champion 🥇",
      description:
        "Excellent progress! Keep building projects and practicing interviews.",
    };
  } else if (growthScore >= 70) {
    achievement = {
      title: "Fast Learner 🚀",
      description:
        "You're improving quickly. Focus on strengthening your technical skills.",
    };
  } else if (growthScore >= 60) {
    achievement = {
      title: "Emerging Developer 💻",
      description:
        "Good foundation. Continue improving your resume and interview performance.",
    };
  } else {
    achievement = {
      title: "Career Starter 🌱",
      description:
        "Complete your resume analysis and practice interviews to unlock higher achievements.",
    };
  }
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

            <h2 className="mt-2 text-5xl font-black text-cyan-400">
              {growthScore}%
            </h2>

            <p className="mt-1 text-sm text-cyan-300">
              Based on Resume + Interview Performance
            </p>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Resume Progress",
            value: `${resumeScore}%`,
            icon: FileText,
            color: "text-purple-400",
          },
          {
            title: "Interview Progress",
            value: `${interviewScore}%`,
            icon: Mic,
            color: "text-cyan-400",
          },
          {
            title: "Roadmap Progress",
            value: `${roadmapProgress}%`,
            icon: Target,
            color: "text-green-400",
          },
          {
            title: "Skill Match",
            value: `${skillGrowth}%`,
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
            {skills.length === 0 ? (
              <p className="text-gray-400">
                Complete a Resume Analysis and an Interview to generate your
                skill progress.
              </p>
            ) : (
              skills.map((skill) => (
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
              ))
            )}
          </div>
        </div>

        {/* Achievement */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-bold text-white">Achievement</h2>

          <div className="mt-8 text-center">
            <Award size={70} className="mx-auto text-yellow-400" />

            <h3 className="mt-5 text-xl font-bold text-white">
              {achievement.title}
            </h3>

            <p className="mt-3 text-center text-gray-400">
              {achievement.description}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Performance Overview</h2>

        <div className="mt-8 space-y-6">
          {[
            {
              label: "Resume",
              value: resumeScore,
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Interview",
              value: interviewScore,
              color: "from-cyan-500 to-blue-500",
            },
            {
              label: "Roadmap",
              value: roadmapProgress,
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Skills",
              value: skillGrowth,
              color: "from-orange-500 to-yellow-500",
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex justify-between">
                <span className="text-gray-300">{item.label}</span>

                <span className="font-semibold text-white">{item.value}%</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                  style={{
                    width: `${item.value}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">AI Growth Insights</h2>

        <div className="mt-6 space-y-4">
          {insights.length === 0 ? (
            <div className="rounded-2xl border border-white/10 p-6 text-gray-400">
              Complete Resume Analysis and an AI Interview to receive
              personalized growth insights.
            </div>
          ) : (
            insights.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-cyan-300"
              >
                💡 {item}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
