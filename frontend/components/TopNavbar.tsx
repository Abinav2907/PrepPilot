"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  name?: string;
  email?: string;
  role?: string;
};

type TopNavbarProps = {
  onMenuClick?: () => void;
  user?: User;
};

export default function TopNavbar({ onMenuClick, user }: TopNavbarProps) {
  const pathname = usePathname();
  const title = pathname.split("/").pop()?.replace("-", " ") || "Dashboard";

  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const close = () => setShowProfile(false);

    if (showProfile) {
      document.addEventListener("click", close);
    }

    return () => document.removeEventListener("click", close);
  }, [showProfile]);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[320px] h-20 z-40 bg-[#050816]/90 backdrop-blur-xl border-b border-white/10">
      <div className="h-full px-4 md:px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center"
            aria-label="Open menu"
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
            onClick={(e) => {
              e.stopPropagation();
              setShowProfile(!showProfile);
            }}
            className="h-11 w-11 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center font-bold"
            aria-label={
              user?.name ? `Open profile for ${user.name}` : "Open profile"
            }
            title={
              user?.name ? `Open profile for ${user.name}` : "Open profile"
            }
          >
            {user?.name?.charAt(0) || "A"}
          </button>

          {showProfile && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-6 top-16 w-80 rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
                  {user?.name?.charAt(0) || "A"}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    {user?.name || "User"}
                  </h2>

                  <p className="text-gray-400 text-sm">{user?.email || "-"}</p>
                </div>
              </div>

              <hr className="my-5 border-white/10" />

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase text-gray-500">Full Name</p>

                  <p className="text-white font-medium">{user?.name || "-"}</p>
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500">Email</p>

                  <p className="text-white font-medium break-all">
                    {user?.email || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500">Target Role</p>

                  <p className="text-cyan-400 font-semibold">
                    {user?.role || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
