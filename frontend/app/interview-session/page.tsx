"use client";
import { useEffect, useState, useRef } from "react";

import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function InterviewSession() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
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
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      const updated = [...answers];
      updated[currentQuestion] = transcript;
      setAnswers(updated);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [currentQuestion, answers]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const startRecording = () => {
    if (!recognitionRef.current) return;

    setIsRecording(true);
    recognitionRef.current.start();
  };
  const stopRecording = () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsRecording(false);
  };
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

      if (!user) {
        alert("Authentication error: No active user session found.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/interview/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            questions,
            answers,
          }),
        },
      );

      const data = await response.json();
      console.log("Backend Response Data:", data);

      // Save to localStorage using standard camelCase naming conventions

      // Map cleanly to snake_case columns for the Supabase insertion
      const { data: savedData, error: dbError } = await supabase
        .from("interview_analysis")
        .upsert(
          {
            user_id: user.id,
            overall_score: data.overallScore,
            technical: data.technical,
            communication: data.communication,
            confidence: data.confidence,
            strengths: data.strengths,
            weaknesses: data.weaknesses,
            feedback: data.feedback,
          },
          {
            onConflict: "user_id",
          },
        )
        .select();

      if (dbError) {
        console.error("Supabase Database Error Details:", dbError);
        alert(`Database Error: ${dbError.message}`);
        return;
      }

      router.push("/main/interview-analysis");
    } catch (err) {
      console.error("Execution error during submission processing:", err);
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
    <main className="min-h-screen bg-[#050816] text-white px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl">
              AI Interview Session
            </h1>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Answer every question honestly.
            </p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-2xl border border-cyan-500/30 bg-[#111827] px-4 py-3 md:w-auto">
            <Clock className="text-cyan-400" size={20} />

            <div>
              <p className="text-sm text-gray-400">Time Left</p>

              <p className="text-xl font-bold text-cyan-400 sm:text-2xl">
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm sm:text-base">
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

        <div className="rounded-3xl border border-white/10 bg-[#111827] p-5 sm:p-8 lg:p-10">
          <p className="text-cyan-400 font-semibold mb-4">Question</p>

          <h2 className="mb-6 text-xl font-bold leading-relaxed sm:text-2xl lg:text-3xl">
            {questions[currentQuestion]}
          </h2>
          <div className="mt-5 mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <div className="text-sm text-gray-400">
              {isRecording ? (
                <span className="flex items-center gap-2 text-red-400 font-medium">
                  <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                  Recording... Speak now
                </span>
              ) : (
                <span className="text-gray-400">
                  Press the microphone and start speaking.
                </span>
              )}
            </div>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 ${
                isRecording
                  ? "bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/30"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30"
              }`}
            >
              {isRecording ? <>🔴 Stop Recording</> : <>🎤 Start Recording</>}
            </button>
          </div>
          <textarea
            value={answers[currentQuestion]}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
            className="
w-full
h-56
sm:h-64
lg:h-72
              rounded-2xl
              bg-[#0B1220]
              border
              border-white/10
              p-4
sm:p-6
              resize-none
              outline-none
              focus:border-cyan-500
              transition
            "
          />
          <div className="mt-3 flex flex-col gap-2 text-sm text-gray-400 sm:flex-row sm:justify-between">
            <span>{answers[currentQuestion].length} Characters</span>

            <span>Be as detailed as possible.</span>
          </div>

          {/* Buttons */}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
            {" "}
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="
flex
w-full
items-center
justify-center
gap-2
rounded-xl
bg-white/10
px-6
py-3
sm:w-auto
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
w-full
rounded-xl
bg-gradient-to-r
from-green-500
to-cyan-500
px-8
py-3
font-semibold
sm:w-auto
"
              >
                Submit Interview
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="
flex
w-full
items-center
justify-center
gap-2
rounded-xl
bg-gradient-to-r
from-purple-600
to-cyan-500
px-8
py-3
font-semibold
sm:w-auto
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
