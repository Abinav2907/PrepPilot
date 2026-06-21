"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please login first.");
        return;
      }

      const extension = selectedFile.name.split(".").pop();
      const fileName = `${user.id}.${extension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, selectedFile, {
          upsert: true,
        });

      console.log("UPLOAD DATA:", uploadData);
      console.log("UPLOAD ERROR:", uploadError);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

      const fileUrl = urlData.publicUrl;

      const { data: existingResume } = await supabase
        .from("resumes")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let dbData: any = null;
      let dbError: any = null;
      console.log("EXISTING RESUME:", existingResume);
      if (existingResume) {
        const result = await supabase
          .from("resumes")
          .update({
            file_name: selectedFile.name,
            file_url: fileUrl,
          })
          .eq("user_id", user.id);

        dbData = result.data;
        dbError = result.error;
      } else {
        const result = await supabase.from("resumes").insert({
          user_id: user.id,
          file_name: selectedFile.name,
          file_url: fileUrl,
        });

        dbData = result.data;
        dbError = result.error;
      }

      if (dbError) {
        throw dbError;
      }

      console.log("DB DATA:", dbData);
      console.log("DB ERROR:", dbError);

      router.push("/main/resume-analysis");
    } catch (error: any) {
      console.log("FULL ERROR:", error);
      console.log("MESSAGE:", error?.message);
      console.log("DETAILS:", error?.details);

      setError(error?.message || "Failed to upload resume.");
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

          {!selectedFile ? (
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
          ) : (
            <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-8">
              <div className="flex items-center gap-4">
                <div className="text-4xl">✅</div>

                <div className="flex-1">
                  <h3 className="font-semibold text-green-400">
                    Resume Selected
                  </h3>

                  <p className="text-gray-300">{selectedFile.name}</p>

                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedFile(null);
                    fileInputRef.current?.click();
                  }}
                  className="rounded-lg bg-white/10 px-4 py-2"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Selected File */}

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
