"use client";

import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-[320px]">
        {/* Fixed Top Navbar */}
        <TopNavbar />

        {/* Page Content */}
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
