"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Target,
  Briefcase,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  full_name: string | null;
  college: string | null;
  degree: string | null;
  year_of_study: string | null;
  target_role: string | null;
}

interface ResumeAnalysis {
  resume_score: number;
  ats_score: number;
  matched_skills: number;
  missing_skills: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  missing_skill_list: string[];
}

interface Resume {
  file_name: string;
  created_at: string;
  file_url: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // Profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, college, degree, year_of_study, target_role")
          .eq("id", user.id)
          .single();

        if (profileData) setProfile(profileData);

        // Latest resume file info
        const { data: resumeData } = await supabase
          .from("resumes")
          .select("file_name, created_at, file_url")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (resumeData) setResume(resumeData);

        // Latest resume analysis
        const { data: analysisData } = await supabase
          .from("resume_analysis")
          .select(
            "resume_score, ats_score, matched_skills, missing_skills, strengths, weaknesses, recommendations, missing_skill_list",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (analysisData) setAnalysis(analysisData);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────────

  const stats = [
    {
      title: "Resume Score",
      value: loading ? "—" : analysis ? String(analysis.resume_score) : "N/A",
      sub: "Overall quality",
      icon: FileText,
      color: "from-purple-600/20 to-purple-500/5",
      border: "border-purple-500/20",
      text: "text-purple-400",
    },
    {
      title: "ATS Score",
      value: loading ? "—" : analysis ? String(analysis.ats_score) : "N/A",
      sub: "ATS compatibility",
      icon: Target,
      color: "from-cyan-600/20 to-cyan-500/5",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
    },
    {
      title: "Skills Matched",
      value: loading ? "—" : analysis ? String(analysis.matched_skills) : "N/A",
      sub: "Keywords found",
      icon: Briefcase,
      color: "from-green-600/20 to-green-500/5",
      border: "border-green-500/20",
      text: "text-green-400",
    },
    {
      title: "Skill Gaps",
      value: loading ? "—" : analysis ? String(analysis.missing_skills) : "N/A",
      sub: "Skills to add",
      icon: AlertCircle,
      color: "from-orange-600/20 to-orange-500/5",
      border: "border-orange-500/20",
      text: "text-orange-400",
    },
  ];

  const goals = [
    {
      label: "Resume Quality",
      value: analysis?.resume_score ?? 0,
      color: "from-purple-500 to-purple-400",
    },
    {
      label: "ATS Compatibility",
      value: analysis?.ats_score ?? 0,
      color: "from-cyan-500 to-cyan-400",
    },
    {
      label: "Skill Coverage",
      value: analysis
        ? Math.round(
            (analysis.matched_skills /
              (analysis.matched_skills + analysis.missing_skills)) *
              100,
          )
        : 0,
      color: "from-green-500 to-emerald-400",
    },
  ];

  const recentActivity = analysis
    ? [
        { icon: "✅", text: "Resume analysis completed" },
        {
          icon: "🎯",
          text: `ATS score: ${analysis.ats_score} — ${analysis.matched_skills} skills matched`,
        },
        {
          icon: "⚠️",
          text: `${analysis.missing_skills} skill gap${analysis.missing_skills !== 1 ? "s" : ""} identified`,
        },
        {
          icon: "💡",
          text: analysis.recommendations?.[0]
            ? analysis.recommendations[0].slice(0, 70) +
              (analysis.recommendations[0].length > 70 ? "…" : "")
            : "Check AI recommendations",
        },
      ]
    : [
        { icon: "📄", text: "No resume uploaded yet — get started below" },
        { icon: "🎤", text: "Interview history will appear here" },
        { icon: "📊", text: "ATS improvements will be tracked here" },
        { icon: "🚀", text: "AI insights will be generated after upload" },
      ];

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* ── HERO ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-black text-white md:text-5xl">
              Welcome Back
              {profile?.full_name
                ? `, ${profile.full_name.split(" ")[0]}`
                : ""}{" "}
              👋
            </h2>
            <p className="mt-3 max-w-2xl text-gray-400">
              {profile?.target_role
                ? `Tracking your journey toward becoming a ${profile.target_role}.`
                : "Track your resume quality, interview readiness and career growth all in one place."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 p-5">
              <p className="text-xs text-gray-400">Current Level</p>
              <h3 className="mt-1 text-2xl font-black text-white">
                {profile?.degree ?? "Explorer"}
              </h3>
              {profile?.target_role && (
                <p className="mt-0.5 text-sm text-purple-300">
                  {profile.target_role}
                </p>
              )}
            </div>

            {resume && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs text-gray-400">Last Resume</p>
                <p className="mt-1 truncate text-sm font-semibold text-white">
                  {resume.file_name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {new Date(resume.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`rounded-3xl border ${stat.border} bg-gradient-to-br ${stat.color} p-6 backdrop-blur-xl`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <h2 className={`mt-3 text-5xl font-black ${stat.text}`}>
                    {stat.value}
                  </h2>
                  <p className="mt-2 text-xs text-gray-500">{stat.sub}</p>
                </div>
                <Icon size={38} className={`${stat.text} opacity-80`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* LEFT col (2/3) */}
        <div className="space-y-6 xl:col-span-2">
          {/* Recent Activity */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <div className="mt-6 space-y-3">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses — only if analysis exists */}
          {analysis && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Strengths */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                  <CheckCircle2 size={20} className="text-green-400" />
                  Strengths
                </h2>
                <div className="mt-4 space-y-3">
                  {analysis.strengths?.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300"
                    >
                      ✓ {item.length > 80 ? item.slice(0, 77) + "…" : item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                  <AlertCircle size={20} className="text-red-400" />
                  Improvement Areas
                </h2>
                <div className="mt-4 space-y-3">
                  {analysis.weaknesses?.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
                    >
                      ✕ {item.length > 80 ? item.slice(0, 77) + "…" : item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {analysis?.recommendations && analysis.recommendations.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                <Zap size={22} className="text-cyan-400" />
                AI Recommendations
              </h2>
              <div className="mt-6 space-y-3">
                {analysis.recommendations.slice(0, 4).map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-300"
                  >
                    💡 {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT col (1/3) */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push("/resume-upload")}
                className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 p-4 font-semibold text-white transition hover:scale-[1.02]"
              >
                <span>Upload Resume</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => router.push("/main/resume-analysis")}
                className="flex w-full items-center justify-between rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 font-semibold text-purple-300 transition hover:bg-purple-500/20"
              >
                <span>View Analysis</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => router.push("/main/interview")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 font-semibold text-white transition hover:bg-white/10"
              >
                <span>Start Interview</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => router.push("/main/interview-analysis")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 font-semibold text-white transition hover:bg-white/10"
              >
                <span>Interview Analysis</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Missing Skills */}
          {analysis?.missing_skill_list &&
            analysis.missing_skill_list.length > 0 && (
              <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
                <h2 className="text-xl font-bold text-white">Missing Skills</h2>
                <p className="mt-1 text-xs text-gray-400">
                  Add these to your resume
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.missing_skill_list.slice(0, 8).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Skill Gap Summary */}
          {analysis && (
            <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">
              <p className="text-sm text-gray-400">Skill Gap Summary</p>
              <div className="mt-4 flex items-end gap-6">
                <div>
                  <p className="text-4xl font-black text-green-400">
                    {analysis.matched_skills}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">matched</p>
                </div>
                <div className="mb-1 text-gray-600">vs</div>
                <div>
                  <p className="text-4xl font-black text-red-400">
                    {analysis.missing_skills}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">missing</p>
                </div>
              </div>
              {/* mini bar */}
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                  style={{
                    width: `${Math.round(
                      (analysis.matched_skills /
                        (analysis.matched_skills + analysis.missing_skills)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SCORE PROGRESS ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Score Breakdown</h2>
        <div className="mt-6 space-y-5">
          {goals.map((goal) => (
            <div key={goal.label}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-300">{goal.label}</span>
                <span className="font-semibold text-white">{goal.value}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${goal.color} transition-all duration-700`}
                  style={{ width: `${goal.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEXT STEPS ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Next Steps</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(analysis
            ? [
                {
                  emoji: "🛠️",
                  title: `Close ${analysis.missing_skills} skill gap${analysis.missing_skills !== 1 ? "s" : ""}`,
                  desc: "Learn the missing skills to strengthen your profile",
                },
                {
                  emoji: "🎤",
                  title: "Mock Interview",
                  desc: "Practice with AI and get instant feedback",
                },
                {
                  emoji: "📈",
                  title: "Boost ATS Score",
                  desc: "Optimise keywords to pass applicant tracking systems",
                },
              ]
            : [
                {
                  emoji: "📄",
                  title: "Upload Your Resume",
                  desc: "Get a full AI-powered analysis in seconds",
                },
                {
                  emoji: "🎤",
                  title: "Start Practicing",
                  desc: "AI interviews tailored to your target role",
                },
                {
                  emoji: "📊",
                  title: "Track Progress",
                  desc: "See your improvement over time",
                },
              ]
          ).map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <span className="text-2xl">{step.emoji}</span>
              <p className="mt-3 font-semibold text-white">{step.title}</p>
              <p className="mt-1 text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
