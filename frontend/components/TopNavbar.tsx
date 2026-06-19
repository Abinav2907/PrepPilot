"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function TopNavbar() {
  const pathname = usePathname();

  const title = pathname.split("/").pop()?.replace("-", " ") || "Dashboard";

  return (
    <header
      className="
fixed
top-0
right-0
left-0
lg:left-[320px]
h-20
z-40
bg-[#050816]/90
backdrop-blur-xl
border-b
border-white/10
"
    >
      <div className="h-full px-4 md:px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}

          <button
            className="
            lg:hidden
            h-11
            w-11
            rounded-xl
            bg-white/5
            flex
            items-center
            justify-center
          "
            title="Open menu"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="capitalize text-xl md:text-2xl font-bold">
              {title}
            </h1>

            <p className="hidden md:block text-sm text-gray-400">
              Track your career preparation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="
            h-11
            w-11
            rounded-full
            bg-white/5
            flex
            items-center
            justify-center
          "
            title="Notifications"
          >
            <Bell size={18} />
          </button>

          <div
            className="
            h-11
            w-11
            rounded-full
            bg-gradient-to-r
            from-purple-500
            to-cyan-400
            flex
            items-center
            justify-center
            font-bold
          "
          >
            A
          </div>
        </div>
      </div>
    </header>
  );
}
