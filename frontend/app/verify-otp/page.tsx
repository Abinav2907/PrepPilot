"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [timer, setTimer] = useState(60);
  const email = searchParams.get("email") || "";
  const username = searchParams.get("username") || "";
  const password = searchParams.get("password") || "";
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  //   useEffect(() => {
  //     if (!email) {
  //       router.push("/signup");
  //     }
  //   }, [email, router]);
  const handleResendOtp = async () => {
    if (timer > 0) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setTimer(60);
    alert("OTP sent again");
  };
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = [...otp];

    pastedData.split("").forEach((digit, i) => {
      if (i < 6) {
        newOtp[i] = digit;
      }
    });

    setOtp(newOtp);

    const focusIndex = Math.min(pastedData.length, 5);

    inputRefs.current[focusIndex]?.focus();
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const handleVerifyOtp = async () => {
    if (loading) return;

    const otpCode = otp.join("");

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpCode,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setLoading(false);
        alert(data.message || "Invalid OTP");
        return;
      }

      console.log("EMAIL =", email);
      console.log("USERNAME =", username);
      console.log("PASSWORD =", password);

      const { data: signupData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            display_name: username,
          },
        },
      });

      if (error) {
        setLoading(false);
        const errorMessage = error.message || "Something went wrong";
        const duplicateMessage =
          /already exist(s)?|already registered|duplicate email|duplicate user/i.test(
            errorMessage,
          )
            ? "user already exist"
            : errorMessage;

        alert(duplicateMessage);
        return;
      }

      console.log(signupData);

      setLoading(false);

      alert("Account created successfully!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Something went wrong");
    }
  };
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-4 text-white">
      {/* Background Glow */}
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[150px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[150px]" />

      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg rounded-[24px] sm:rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 backdrop-blur-2xl">
        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              ✦ PrepPilot
            </span>
          </h1>
        </div>

        {/* Heading */}
        <h2 className="mb-3 text-center text-3xl sm:text-4xl font-bold">
          Verify Your Email
        </h2>

        <p className="mb-8 text-center text-gray-400">
          We have sent a verification code to
          <br />
          <span className="text-cyan-400">{email}</span>
        </p>

        {/* OTP Inputs */}
        <div className="mb-8 flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              placeholder="•"
              title={`OTP Digit ${index + 1}`}
              aria-label={`OTP Digit ${index + 1}`}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="
                h-12 w-12
                sm:h-14 sm:w-14
                rounded-xl
                border
                border-white/10
                bg-[#111827]
                text-center
                text-lg
                font-bold
                outline-none
                transition-all
                focus:border-purple-500
                focus:shadow-[0_0_20px_rgba(139,92,246,0.4)]
              "
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyOtp}
          disabled={!isOtpComplete || loading}
          className={`
            w-full
            rounded-xl
            py-3
            sm:py-4
            text-sm
            sm:text-base
            font-semibold
            transition-all
            ${
              isOtpComplete
                ? "bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-[1.02]"
                : "cursor-not-allowed bg-gray-700 text-gray-400"
            }
          `}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">Didn't receive the code?</p>

          <button
            onClick={handleResendOtp}
            disabled={timer > 0}
            className={`mt-2 font-medium transition-all ${
              timer > 0
                ? "cursor-not-allowed text-gray-500"
                : "text-cyan-400 hover:text-cyan-300"
            }`}
          >
            {timer > 0 ? `Resend OTP (${timer}s)` : "Resend OTP"}
          </button>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link
            href="/signup"
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to Signup
          </Link>
        </div>
      </div>
    </main>
  );
}
