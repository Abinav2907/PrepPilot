"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  Mic,
  BarChart3,
  TrendingUp,
  Map,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/main/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Resume Analysis",
    href: "/main/resume-analysis",
    icon: FileText,
  },
  {
    label: "Interview",
    href: "/main/interview",
    icon: Mic,
  },
  {
    label: "Interview Analysis",
    href: "/main/interview-analysis",
    icon: BarChart3,
  },
  {
    label: "Growth Tracker",
    href: "/main/growth-map",
    icon: TrendingUp,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <aside
      className="
flex
fixed
left-0
top-0
h-screen
w-[320px]
flex-col
bg-[#050816]
border-r
border-white/10
"
    >
      {/* Logo */}
      <div className="px-8 pt-8 pb-7 border-b border-white/10">
        <h1
          className="
            text-[50px]
            leading-none
            font-black
            tracking-tight
            bg-gradient-to-r
            from-purple-400
            via-pink-400
            to-cyan-400
            bg-clip-text
            text-transparent
          "
        >
          PrepPilot
        </h1>

        <p className="mt-3 text-sm text-gray-400">AI Career Coach</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  px-5
                  py-4
                  transition-all
                  duration-300
                  ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon size={22} />

                <span className="text-[16px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="
            w-full
            h-14
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            text-red-400
            font-semibold
            flex
            items-center
            justify-center
            gap-3
            hover:bg-red-500/20
            transition-all
            duration-300
          "
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
