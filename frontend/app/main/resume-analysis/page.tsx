"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function ResumeAnalysisPage() {
  const router = useRouter();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [viewUrl, setViewUrl] = useState<string>("");

  const handleDownload = async () => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/resume/download/${resume.user_id}`,
      "_blank",
    );
  };
  const loadResume = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .single();
      console.log("USER:", user);
      console.log("RESUME DATA:", data);
      console.log("RESUME ERROR:", error);
      if (error) {
        console.log(error);
        return;
      }

      setResume(data);

      // Generate a signed URL so the resume opens correctly on both public
      // and private Supabase storage buckets (public URL returns 400 for private buckets)
      try {
        const extension = data.file_name?.split(".").pop() || "pdf";
        const storagePath = `${user.id}.${extension}`;
        const { data: signed } = await supabase.storage
          .from("resumes")
          .createSignedUrl(storagePath, 3600); // valid for 1 hour
        if (signed?.signedUrl) {
          setViewUrl(signed.signedUrl);
        } else {
          setViewUrl(data.file_url); // fallback to stored URL
        }
      } catch (signErr) {
        console.warn("Could not generate signed URL, using stored URL:", signErr);
        setViewUrl(data.file_url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const loadAnalysis = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("resume_analysis")
        .select("*")
        .eq("user_id", user.id)
        .single();

      console.log("ANALYSIS:", data);

      if (error) {
        console.log(error);
        return;
      }

      setAnalysis(data);
      localStorage.setItem(
        "resumeResult",
        JSON.stringify({
          resume_score: data.resume_score,
          ats_score: data.ats_score,
          matched_skills: data.matched_skills,
          missing_skills: data.missing_skills,
          strengths: data.strengths,
          weaknesses: data.weaknesses,
          recommendations: data.recommendations,
          missing_skill_list: data.missing_skill_list,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadResume();
    loadAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading Resume...
      </div>
    );
  }
  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white gap-4">
        <h2 className="text-3xl font-bold">No Resume Found</h2>

        <button
          onClick={() => router.push("/resume-upload")}
          className="px-6 py-3 rounded-xl bg-purple-600"
        >
          Upload Resume
        </button>
      </div>
    );
  }
  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading Analysis...
      </div>
    );
  }
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
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h3 className="text-2xl font-bold text-white">Uploaded Resume</h3>

        <div className="mt-6 space-y-3">
          <p>
            <span className="font-semibold">File Name:</span> {resume.file_name}
          </p>

          <p>
            <span className="font-semibold">Uploaded:</span>{" "}
            {new Date(resume.created_at).toLocaleDateString()}
          </p>

          {viewUrl ? (
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-xl bg-cyan-600 px-5 py-2 text-white font-semibold hover:bg-cyan-500 transition-colors"
            >
              View Resume
            </a>
          ) : (
            <a
              href={resume?.file_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-xl bg-cyan-600 px-5 py-2 text-white font-semibold hover:bg-cyan-500 transition-colors opacity-70"
            >
              View Resume
            </a>
          )}
        </div>
      </div>
      {/* SCORE CARDS */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-3">
        <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">
          <p className="text-gray-400">Resume Score</p>

          <h3 className="mt-3 text-5xl font-black text-purple-400">
            {analysis.resume_score}
          </h3>

          <p className="mt-2 text-sm text-gray-500">Overall Resume Quality</p>
        </div>

        <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
          <p className="text-gray-400">ATS Score</p>

          <h3 className="mt-3 text-5xl font-black text-cyan-400">
            {analysis.ats_score}
          </h3>

          <p className="mt-2 text-sm text-gray-500">ATS Compatibility</p>
        </div>

        <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-6">
          <p className="text-gray-400">Matched Skills</p>

          <h3 className="mt-3 text-5xl font-black text-green-400">
            {analysis.matched_skills}
          </h3>

          <p className="mt-2 text-sm text-gray-500">Skills Identified</p>
        </div>

        <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <p className="text-gray-400">Missing Skills</p>

          <h3 className="mt-3 text-5xl font-black text-orange-400">
            {analysis.missing_skills}
          </h3>

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
            {analysis.strengths?.map((item: string) => (
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
            {analysis.weaknesses?.map((item: string) => (
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
          {analysis.missing_skill_list?.map((skill: string) => (
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
          {analysis.recommendations?.map((item: string) => (
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
          onClick={handleDownload}
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
