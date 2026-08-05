"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from 'lucide-react';
import UserMenu from "@/components/auth/UserMenu";
import { useAuth } from "@/components/AuthProvider";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const SkeletonLoader = () => (
    <div className="h-8 w-8 animate-pulse rounded-full bg-[#EFEFEF] dark:bg-white/15"></div>
  );

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="fixed top-0 z-50 w-full px-4 py-4">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center px-4 py-3">
        <Link className="brand-logo hidden text-4xl text-black dark:text-white md:flex" href="/dashboard">
          Scribo
        </Link>
        <ul className="hidden items-center justify-center rounded-2xl border border-black/25 bg-transparent p-1 text-sm font-medium shadow-[0_12px_40px_rgba(17,17,17,0.08)] backdrop-blur-xl dark:border-white/15 dark:bg-transparent dark:shadow-none md:flex">
          <Link href="/dashboard">
            <li
              className={`rounded-lg px-4 py-2 transition-colors ${
                path == "/dashboard" ? "bg-black text-[#ffffff] shadow-[0_1px_8px_rgba(17,17,17,0.04)] dark:bg-white/15 dark:text-white" : "text-black/70 hover:bg-black hover:text-[#ffffff] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              Dashboard
            </li>
          </Link>
          <Link href="/dashboard/question">
            <li
              className={`rounded-lg px-4 py-2 transition-colors ${
                path == "/dashboard/question" ? "bg-black text-[#ffffff] shadow-[0_1px_8px_rgba(17,17,17,0.04)] dark:bg-white/15 dark:text-white" : "text-black/70 hover:bg-black hover:text-[#ffffff] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              Questions
            </li>
          </Link>
          <Link href="/dashboard/upgrade">
            <li
              className={`rounded-lg px-4 py-2 transition-colors ${
                path == "/dashboard/upgrade" ? "bg-black text-[#ffffff] shadow-[0_1px_8px_rgba(17,17,17,0.04)] dark:bg-white/15 dark:text-white" : "text-black/70 hover:bg-black hover:text-[#ffffff] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              Upgrade
            </li>
          </Link>

          <Link href="/dashboard/howit">
            <li
              className={`rounded-lg px-4 py-2 transition-colors ${
                path == "/dashboard/howit" ? "bg-black text-[#ffffff] shadow-[0_1px_8px_rgba(17,17,17,0.04)] dark:bg-white/15 dark:text-white" : "text-black/70 hover:bg-black hover:text-[#ffffff] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              How it works?
            </li>
          </Link>
        </ul>
        <div className="justify-self-start md:hidden">
          <button onClick={toggleMenu} className="inline-flex items-center justify-center rounded-xl border border-black/25 bg-black p-2 text-[#ffffff] transition-colors hover:bg-black/80 focus:outline-none dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <div className="flex items-center justify-self-end gap-4" >
          {loading ? <SkeletonLoader /> : <UserMenu />}
        </div>
      </div>
      {isOpen && (
        <div className="mx-auto mt-2 max-w-[1180px] space-y-1 rounded-2xl border border-black/25 bg-transparent p-2 shadow-[0_16px_50px_rgba(17,17,17,0.06)] backdrop-blur-xl dark:border-white/15 dark:bg-[#111111] md:hidden">
          <Link href="/dashboard">
            <li
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                path == "/dashboard" ? "bg-black text-[#ffffff] dark:bg-white/15 dark:text-white" : "text-black/70 hover:bg-black hover:text-[#ffffff] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              Dashboard
            </li>
          </Link>
          <Link href="/dashboard/question">
            <li
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                path == "/dashboard/question" ? "bg-black text-[#ffffff] dark:bg-white/15 dark:text-white" : "text-black/70 hover:bg-black hover:text-[#ffffff] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              Questions
            </li>
          </Link>
          <Link href="/dashboard/upgrade">
            <li
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                path == "/dashboard/upgrade" ? "bg-black text-[#ffffff] dark:bg-white/15 dark:text-white" : "text-black/70 hover:bg-black hover:text-[#ffffff] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              Upgrade
            </li>
          </Link>
          <Link href="/dashboard/howit">
            <li
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                path == "/dashboard/howit" ? "bg-black text-[#ffffff] dark:bg-white/15 dark:text-white" : "text-black/70 hover:bg-black hover:text-[#ffffff] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              How it works?
            </li>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
