"use client";

import { useEffect, useState } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function InterviewSession() {
  const [questions, setQuestions] = useState<string[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>([]);

  // 15 minute timer
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  useEffect(() => {
    const storedQuestions = localStorage.getItem("interviewQuestions");

    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions);

      setQuestions(parsedQuestions);

      setAnswers(Array(parsedQuestions.length).fill(""));
    } else {
      router.push("/main/interview");
    }
  }, []);
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = [...answers];
    updated[currentQuestion] = e.target.value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      console.log("===== INTERVIEW FINISHED =====");
      console.log("Questions:", questions);
      console.log("Answers:", answers);

      // Next step:
      // Send questions + answers to backend
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };
  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const response = await fetch(
        "http://localhost:5000/api/interview/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            questions,
            answers,
          }),
        },
      );

      const data = await response.json();

      localStorage.setItem("interviewResult", JSON.stringify(data));

      router.push("/main/interview-analysis");
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate interview. Please try again.");
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  if (questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-white text-2xl">
        Loading Interview...
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black">AI Interview Session</h1>

            <p className="text-gray-400 mt-2">
              Answer every question honestly.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-[#111827] px-6 py-4 flex items-center gap-3">
            <Clock className="text-cyan-400" size={24} />

            <div>
              <p className="text-sm text-gray-400">Time Left</p>

              <p className="text-2xl font-bold text-cyan-400">
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-cyan-400 font-semibold">
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span className="text-gray-400">{Math.round(progress)}%</span>
          </div>

          <div className="h-3 rounded-full bg-white/10">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}

        <div className="rounded-3xl border border-white/10 bg-[#111827] p-10">
          <p className="text-cyan-400 font-semibold mb-4">Question</p>

          <h2 className="text-3xl font-bold leading-relaxed mb-8">
            {questions[currentQuestion]}
          </h2>

          <textarea
            value={answers[currentQuestion]}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
            className="
              w-full
              h-72
              rounded-2xl
              bg-[#0B1220]
              border
              border-white/10
              p-6
              resize-none
              outline-none
              focus:border-cyan-500
              transition
            "
          />

          <div className="mt-3 flex justify-between text-gray-400">
            <span>{answers[currentQuestion].length} Characters</span>

            <span>Be as detailed as possible.</span>
          </div>

          {/* Buttons */}

          <div className="mt-10 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-white/10
                px-6
                py-3
                disabled:opacity-40
              "
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="
    rounded-xl
    bg-gradient-to-r
    from-green-500
    to-cyan-500
    px-8
    py-3
    font-semibold
  "
              >
                Submit Interview
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-purple-600
                  to-cyan-500
                  px-8
                  py-3
                  font-semibold
                "
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
