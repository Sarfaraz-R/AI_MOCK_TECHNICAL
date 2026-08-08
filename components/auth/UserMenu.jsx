"use client";

import React from "react";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function UserMenu() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-black/25 bg-black px-2 py-2 dark:border-white/15 dark:bg-white/10">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-[#ffffff] dark:border-white/15 dark:bg-white/10 dark:text-white"
        title={user?.name || user?.email || "Signed in"}
      >
        {initials || <UserRound className="h-4 w-4" />}
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="premium-button-animated inline-flex items-center gap-1 rounded-lg border border-transparent px-2 py-1 text-sm text-white/75 [--button-bg:transparent] [--button-hover-bg:rgba(255,255,255,0.15)] [--button-text:rgba(255,255,255,0.75)] [--button-text-hover:#ffffff] dark:text-white/70 dark:[--button-hover-bg:rgba(255,255,255,0.1)] dark:[--button-text:rgba(255,255,255,0.7)] dark:[--button-text-hover:#ffffff]"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}
