"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />

          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-[320px]">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main
          className="
            pt-24
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
            pb-8
            min-h-screen
          "
        >
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
