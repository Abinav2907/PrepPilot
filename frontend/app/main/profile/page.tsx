"use client";

import {
  Mail,
  GraduationCap,
  Award,
  FileText,
  Target,
  Briefcase,
  Edit,
} from "lucide-react";

export default function ProfilePage() {
  const user = {
    name: "Abinav M",
    email: "abinav@example.com",
    college: "Chennai Institute of Technology",
    degree: "B.E Computer Science",
    resumeScore: 88,
    atsScore: 82,
    interviewsCompleted: 12,
    roadmapProgress: 67,
  };

  const skills = [
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "MongoDB",
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-4xl font-black text-white">
            A
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-black text-white">{user.name}</h1>

            <div className="mt-4 flex flex-col gap-3 text-gray-400">
              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap size={18} />
                <span>{user.college}</span>
              </div>
            </div>
          </div>

          <button
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              to-cyan-500
              px-6
              py-3
              font-semibold
              text-white
            "
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Resume Score</p>

              <h2 className="mt-3 text-5xl font-black text-purple-400">
                {user.resumeScore}
              </h2>
            </div>

            <FileText size={40} className="text-purple-400" />
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">ATS Score</p>

              <h2 className="mt-3 text-5xl font-black text-cyan-400">
                {user.atsScore}
              </h2>
            </div>

            <Target size={40} className="text-cyan-400" />
          </div>
        </div>

        <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Interviews</p>

              <h2 className="mt-3 text-5xl font-black text-green-400">
                {user.interviewsCompleted}
              </h2>
            </div>

            <Briefcase size={40} className="text-green-400" />
          </div>
        </div>

        <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Roadmap</p>

              <h2 className="mt-3 text-5xl font-black text-orange-400">
                {user.roadmapProgress}%
              </h2>
            </div>

            <Award size={40} className="text-orange-400" />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Skills</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill}
              className="
                rounded-full
                border
                border-cyan-500/20
                bg-cyan-500/10
                px-5
                py-2
                text-cyan-300
              "
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Achievements</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "Resume Expert",
            "Interview Challenger",
            "14 Day Learning Streak",
          ].map((achievement) => (
            <div
              key={achievement}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="font-semibold text-white">🏆 {achievement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Account Summary */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-bold text-white">Account Summary</h2>

        <div className="mt-6 space-y-4 text-gray-300">
          <p>
            Degree:
            <span className="ml-2 text-white">{user.degree}</span>
          </p>

          <p>
            College:
            <span className="ml-2 text-white">{user.college}</span>
          </p>

          <p>
            Career Level:
            <span className="ml-2 text-cyan-400">Career Explorer</span>
          </p>
        </div>
      </div>
    </div>
  );
}
