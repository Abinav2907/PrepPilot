"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function ResumeUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume.");
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
      const { data: existingResume } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (existingResume) {
        const oldFilePath = existingResume.file_url.split("/resumes/")[1];

        await supabase.storage.from("resumes").remove([oldFilePath]);

        await supabase.from("resumes").delete().eq("id", existingResume.id);
      }

      const fileName = `${user.id}-${Date.now()}-${selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("resumes").upsert(
        {
          user_id: user.id,
          file_name: selectedFile.name,
          file_url: publicUrlData.publicUrl,
        },
        {
          onConflict: "user_id",
        },
      );

      if (dbError) {
        throw dbError;
      }

      setSuccess("Resume uploaded successfully!");

      setTimeout(() => {
        router.push("/resume-analysis");
      }, 1000);
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Glow Effects */}
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[150px]" />

      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[150px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 backdrop-blur-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black sm:text-5xl">
              Upload Your Resume
            </h1>

            <p className="mt-3 text-gray-400">
              Upload your resume and let PrepPilot analyze your strengths and
              weaknesses.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
              {success}
            </div>
          )}

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all
              ${
                dragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-white/5"
              }
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-3">
              <div className="text-5xl">📄</div>

              <h3 className="text-xl font-semibold">Drag & Drop Resume</h3>

              <p className="text-gray-400">PDF or DOCX • Max 5MB</p>

              <button
                type="button"
                className="rounded-xl bg-white/10 px-5 py-2"
              >
                Choose File
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handleFileSelect(file);
                }
              }}
            />
          </div>

          {selectedFile && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-4">
              <p className="font-medium">Selected File</p>

              <p className="mt-1 text-gray-400">{selectedFile.name}</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-4 font-semibold transition hover:scale-[1.01] disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Analyze Resume"}
          </button>
        </div>
      </div>
    </main>
  );
}
