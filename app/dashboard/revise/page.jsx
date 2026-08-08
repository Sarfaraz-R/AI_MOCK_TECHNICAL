import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, Sparkles } from "lucide-react";
import { SUBJECTS } from "@/app/dashboard/assessment/_data/questionBank";
import { slugifySubject } from "./_data/revisionDeck";

const RevisePage = () => {
  return (
    <div className="premium-shell">
      <div className="premium-container pt-28 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#666666]">
            Subject Revision
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight text-[#111111] md:text-6xl">
            Top 50 questions for every subject
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-[#666666]">
            Pick one subject, revise the most important concepts fast, and sharpen your answers before the next interview round.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="premium-card p-5 text-[#111111]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dbeafe] bg-[#eff6ff] text-[#1d4ed8]">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-lg font-bold">Pick one lane</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-[#666666]">
              Revise DSA, OS, DBMS, OOP, Java, React, and more without mixing topics.
            </p>
          </div>
          <div className="premium-card p-5 text-[#111111]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#fde68a] bg-[#fef3c7] text-[#b45309]">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-lg font-bold">Interview-first prompts</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-[#666666]">
              Each deck includes recall, examples, pitfalls, and short-answer practice.
            </p>
          </div>
          <div className="premium-card p-5 text-[#111111]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#fecdd3] bg-[#ffe4e6] text-[#e11d48]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-lg font-bold">Built for repetition</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-[#666666]">
              Move through a compact Top 50 set and repeat weak areas until they feel automatic.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {SUBJECTS.map((subject) => (
            <Link
              key={subject}
              href={`/dashboard/revise/${slugifySubject(subject)}`}
              className="premium-card premium-card-hover group flex min-h-[210px] flex-col justify-between p-6 text-[#111111]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#88806f]">
                  Top 50 Revision
                </p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight">{subject}</h2>
                <p className="mt-3 text-sm font-medium leading-6 text-[#666666]">
                  Focused concept review with short interview-ready answers, rapid recap prompts, and common pitfalls.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between text-sm font-semibold text-[#111111]">
                <span>Open deck</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevisePage;
