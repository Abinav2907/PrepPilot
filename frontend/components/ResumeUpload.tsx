"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumeUpload() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are allowed.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    setError("");

    if (!validateFile(file)) return;

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setUploading(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/main/resume-analysis");
    } catch {
      setError("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[180px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[180px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8 md:p-12">
          {/* Header */}

          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black md:text-6xl">
              Upload Your Resume
            </h1>

            <p className="mt-4 text-gray-400">
              Upload your latest resume and get AI-powered analysis.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {/* Upload Area */}

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);

              const file = e.dataTransfer.files[0];

              if (file) {
                handleFileSelect(file);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`
              cursor-pointer
              rounded-3xl
              border-2
              border-dashed
              p-10
              md:p-16
              text-center
              transition-all

              ${
                dragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-white/[0.03]"
              }
            `}
          >
            <div className="space-y-4">
              <div className="text-7xl">📄</div>

              <h2 className="text-2xl font-bold">Drag & Drop Resume</h2>

              <p className="text-gray-400">PDF or DOCX • Max 5MB</p>

              <button
                type="button"
                className="
                  rounded-xl
                  bg-white/10
                  px-6
                  py-3
                  font-medium
                "
              >
                Choose File
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".pdf,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handleFileSelect(file);
                }
              }}
            />
          </div>

          {/* Selected File */}

          {selectedFile && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-5">
              <p className="font-semibold">Selected Resume</p>

              <p className="mt-2 text-gray-400">{selectedFile.name}</p>
            </div>
          )}

          {/* Upload Button */}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="
              mt-8
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              via-violet-500
              to-cyan-500
              py-4
              text-lg
              font-semibold
              text-white
              transition
              hover:scale-[1.01]
              disabled:opacity-50
            "
          >
            {uploading ? "Analyzing Resume..." : "Analyze Resume"}
          </button>
        </div>
      </div>
    </main>
  );
}
