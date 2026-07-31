"use client";
import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isUserButtonLoaded, setUserButtonLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const SkeletonLoader = () => (
    <div className="h-8 w-8 animate-pulse rounded-full bg-[#EFEFEF]"></div>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setUserButtonLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="fixed top-0 z-50 w-full px-4 py-4">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-3">
        <Link className="brand-logo hidden text-4xl text-[#111111] md:flex" href="/dashboard">
          Scribo
        </Link>
        <ul className="hidden items-center p-1 text-sm font-medium md:flex">
          <Link href="/dashboard">
            <li
              className={`rounded-lg px-4 py-2 transition-colors ${
                path == "/dashboard" ? "bg-white/70 text-[#111111] shadow-[0_1px_8px_rgba(17,17,17,0.04)]" : "text-[#666666] hover:bg-white/70 hover:text-[#111111]"
              }`}
            >
              Dashboard
            </li>
          </Link>
          <Link href="/dashboard/question">
            <li
              className={`rounded-lg px-4 py-2 transition-colors ${
                path == "/dashboard/question" ? "bg-white/70 text-[#111111] shadow-[0_1px_8px_rgba(17,17,17,0.04)]" : "text-[#666666] hover:bg-white/70 hover:text-[#111111]"
              }`}
            >
              Questions
            </li>
          </Link>
          <Link href="/dashboard/upgrade">
            <li
              className={`rounded-lg px-4 py-2 transition-colors ${
                path == "/dashboard/upgrade" ? "bg-white/70 text-[#111111] shadow-[0_1px_8px_rgba(17,17,17,0.04)]" : "text-[#666666] hover:bg-white/70 hover:text-[#111111]"
              }`}
            >
              Upgrade
            </li>
          </Link>

          <Link href="/dashboard/howit">
            <li
              className={`rounded-lg px-4 py-2 transition-colors ${
                path == "/dashboard/howit" ? "bg-white/70 text-[#111111] shadow-[0_1px_8px_rgba(17,17,17,0.04)]" : "text-[#666666] hover:bg-white/70 hover:text-[#111111]"
              }`}
            >
              How it works?
            </li>
          </Link>
        </ul>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="inline-flex items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-2 text-[#111111] transition-colors hover:bg-[#F5F5F5] focus:outline-none">
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <div className="flex items-center gap-4" >
          <ModeToggle  />
          {isUserButtonLoaded ? <UserButton afterSignOutUrl="/" /> : <SkeletonLoader />}
        </div>
      </div>
      {isOpen && (
        <div className="mx-auto mt-2 max-w-[1180px] space-y-1 rounded-2xl border border-[#E5E5E5] bg-white p-2 shadow-[0_16px_50px_rgba(17,17,17,0.06)] md:hidden">
          <Link href="/dashboard">
            <li
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                path == "/dashboard" ? "bg-[#F5F5F5] text-[#111111]" : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]"
              }`}
            >
              Dashboard
            </li>
          </Link>
          <Link href="/dashboard/question">
            <li
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                path == "/dashboard/question" ? "bg-[#F5F5F5] text-[#111111]" : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]"
              }`}
            >
              Questions
            </li>
          </Link>
          <Link href="/dashboard/upgrade">
            <li
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                path == "/dashboard/upgrade" ? "bg-[#F5F5F5] text-[#111111]" : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]"
              }`}
            >
              Upgrade
            </li>
          </Link>
          <Link href="/dashboard/howit">
            <li
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                path == "/dashboard/howit" ? "bg-[#F5F5F5] text-[#111111]" : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]"
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
