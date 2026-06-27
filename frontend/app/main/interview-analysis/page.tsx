"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/lib/supabase";
interface InterviewResult {
  overallScore: number;
  technical: number;
  communication: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string[];
}

export default function InterviewAnalysisPage() {
  const router = useRouter();

  const [interviewData, setInterviewData] = useState<InterviewResult | null>(
    null,
  );
  const downloadReport = () => {
    if (!interviewData) return;

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("PrepPilot AI Interview Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Overall Score: ${interviewData.overallScore}`, 14, 35);
    doc.text(`Technical Score: ${interviewData.technical}`, 14, 45);
    doc.text(`Communication Score: ${interviewData.communication}`, 14, 55);
    doc.text(`Confidence Score: ${interviewData.confidence}`, 14, 65);

    autoTable(doc, {
      startY: 80,
      head: [["Strengths"]],
      body: interviewData.strengths.map((item) => [item]),
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Weaknesses"]],
      body: interviewData.weaknesses.map((item) => [item]),
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["AI Feedback"]],
      body: interviewData.feedback.map((item) => [item]),
    });

    doc.save("PrepPilot_Interview_Report.pdf");
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterview = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("interview_analysis")
        .select("*")
        .eq("user_id", user.id)
        .single();
      console.log("Logged in user:", user.id);
      console.log("Supabase data:", data);
      console.log("Supabase error:", error);
      if (!error && data) {
        setInterviewData({
          overallScore: data.overall_score,
          technical: data.technical,
          communication: data.communication,
          confidence: data.confidence,
          strengths: data.strengths || [],
          weaknesses: data.weaknesses || [],
          feedback: data.feedback || [],
        });
      }

      setLoading(false);
    };

    loadInterview();
  }, []);
  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-500/20 text-5xl">
            🎤
          </div>

          <h1 className="text-4xl font-black text-white">
            No Interview Taken Yet
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-400">
            You haven&apos;t completed an AI interview yet.
            <br />
            Take your first interview to receive a detailed performance
            analysis, personalized feedback, strengths, weaknesses, and
            improvement recommendations.
          </p>

          <button
            onClick={() => router.push("/main/interview")}
            className="
              mt-10
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              to-cyan-500
              px-10
              py-4
              text-lg
              font-bold
              text-white
              transition
              hover:scale-105
            "
          >
            🚀 Start Your First Interview
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white md:text-5xl">
            Interview Analysis
          </h1>

          <p className="mt-2 text-gray-400">
            Detailed AI evaluation of your interview performance.
          </p>
        </div>

        <button
          onClick={() => router.push("/main/interview")}
          className="
            w-full
            lg:w-auto
            rounded-2xl
            bg-gradient-to-r
            from-purple-600
            via-violet-500
            to-cyan-500
            px-6
            py-4
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
          "
        >
          🎤 Start New Interview
        </button>
      </div>

      {/* Score Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-8">
          <p className="text-gray-400">Overall Score</p>

          <h2 className="mt-4 text-6xl font-black text-purple-400">
            {interviewData.overallScore}
          </h2>

          <p className="mt-2 text-gray-500">Interview Performance</p>
        </div>

        <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-8">
          <p className="text-gray-400">Technical</p>

          <h2 className="mt-4 text-6xl font-black text-cyan-400">
            {interviewData.technical}
          </h2>

          <p className="mt-2 text-gray-500">Technical Knowledge</p>
        </div>

        <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-8">
          <p className="text-gray-400">Communication</p>

          <h2 className="mt-4 text-6xl font-black text-green-400">
            {interviewData.communication}
          </h2>

          <p className="mt-2 text-gray-500">Communication Skills</p>
        </div>

        <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-8">
          <p className="text-gray-400">Confidence</p>

          <h2 className="mt-4 text-6xl font-black text-orange-400">
            {interviewData.confidence}
          </h2>

          <p className="mt-2 text-gray-500">Confidence Level</p>
        </div>
      </div>

      {/* Strengths + Weaknesses */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <h3 className="text-2xl font-bold text-white">Strengths</h3>

          <div className="mt-6 space-y-4">
            {(interviewData.strengths || []).map((item) => (
              <div
                key={item}
                className="
                  rounded-2xl
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
          <h3 className="text-2xl font-bold text-white">Areas To Improve</h3>

          <div className="mt-6 space-y-4">
            {(interviewData.weaknesses || []).map((item) => (
              <div
                key={item}
                className="
                  rounded-2xl
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

      {/* AI Recommendations */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>

        <div className="mt-6 space-y-4">
          {(interviewData.feedback || []).map((item) => (
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

      {/* Performance Summary */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h3 className="text-2xl font-bold text-white">Performance Summary</h3>

        <p className="mt-5 leading-8 text-gray-300">
          Overall Score: {interviewData.overallScore}/100. Your technical score
          is {interviewData.technical}, communication score is{" "}
          {interviewData.communication}, and confidence score is{" "}
          {interviewData.confidence}.
        </p>
      </div>

      {/* Bottom Buttons */}
      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={downloadReport}
          className="
    rounded-2xl
    border
    border-white/10
    bg-white/[0.03]
    p-4
    font-semibold
    transition
    hover:bg-white/10
  "
        >
          📥 Download Report
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
          Back To Dashboard →
        </button>
      </div>
    </div>
  );
}
