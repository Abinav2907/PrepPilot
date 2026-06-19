"use client";

import { useRouter } from "next/navigation";

export default function InterviewAnalysisPage() {
  const router = useRouter();

  const interviewData = {
    overallScore: 84,
    technicalScore: 88,
    communicationScore: 79,
    confidenceScore: 85,

    strengths: [
      "Strong React fundamentals",
      "Good problem-solving approach",
      "Clear technical explanations",
      "Confident responses",
    ],

    weaknesses: [
      "Need deeper system design knowledge",
      "Improve database optimization concepts",
      "Reduce filler words while speaking",
      "Provide more real-world examples",
    ],

    recommendations: [
      "Practice advanced React interview questions",
      "Learn system design fundamentals",
      "Improve communication clarity",
      "Study MongoDB indexing",
      "Mock interview practice twice weekly",
    ],
  };

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
            {interviewData.technicalScore}
          </h2>

          <p className="mt-2 text-gray-500">Technical Knowledge</p>
        </div>

        <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-8">
          <p className="text-gray-400">Communication</p>

          <h2 className="mt-4 text-6xl font-black text-green-400">
            {interviewData.communicationScore}
          </h2>

          <p className="mt-2 text-gray-500">Communication Skills</p>
        </div>

        <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-8">
          <p className="text-gray-400">Confidence</p>

          <h2 className="mt-4 text-6xl font-black text-orange-400">
            {interviewData.confidenceScore}
          </h2>

          <p className="mt-2 text-gray-500">Confidence Level</p>
        </div>
      </div>

      {/* Strengths + Weaknesses */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <h3 className="text-2xl font-bold text-white">Strengths</h3>

          <div className="mt-6 space-y-4">
            {interviewData.strengths.map((item) => (
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
            {interviewData.weaknesses.map((item) => (
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
          {interviewData.recommendations.map((item) => (
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
          You performed well in the technical section and demonstrated strong
          React knowledge. Communication was good overall, but you can improve
          by providing more structured answers and reducing filler words. Focus
          on system design, backend architecture, and real-world project
          discussions to improve your interview success rate.
        </p>
      </div>

      {/* Bottom Buttons */}
      <div className="grid gap-4 md:grid-cols-2">
        <button
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
