"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }
      console.log("USER ID:", user.id);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      console.log("PROFILE:", profile);
      console.log("PROFILE ERROR:", error);

      if (profile) {
        router.push("/main/dashboard");
      } else {
        router.push("/onboarding");
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
      <div className="text-center">
        <div className="h-10 w-10 mx-auto border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
}
